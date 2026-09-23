import { expect, test, type Page } from "@playwright/test";

/**
 * EditMenu 回归（HIG-AUD-020 / 021），全部走文档站真实示例。
 *
 * 020：`touchend` 浮现胶囊后浏览器会补发一次**合成 `mousedown`**（Chromium 上
 * `sourceCapabilities.firesTouchEvents === true`）——其 target 是手指落点、不在胶囊内，
 * 于是「点他处即关闭」把胶囊立刻收掉（实测 `visible → exiting → visible` 闪烁）。
 * 021：① 翻转下方后缺垂直 clamp 会溢出视口下沿；② 剪切用已 trim 文本会残留首尾空白；
 * ③ 剪贴板写入失败仍触发 `onCut` 会造成数据丢失。
 *
 * 本机覆盖不到的部分（见交付书 §9）：iOS 原生 callout 是否真的被抑制——`-webkit-touch-callout`
 * 在 Blink 与 jsdom 中都取不到计算值，属 WebKit-only，需真机复核。
 */

const CAPSULE = '[data-slot="edit-menu-capsule"]';
const CONTAINER = '[data-slot="edit-menu"]';
const PARAGRAPH = `${CONTAINER} p`;
const INITIAL_TEXT =
  "Select any words in this sentence to reveal the floating edit capsule above the selection.";
/** 示例里紧跟在 EditMenu 之后的日志行（`<p>` 是容器的兄弟节点，不在容器内） */
const LOG_LINE = '[data-slot="edit-menu"] + p';

// 本文件全部是轻量 demo 交互：默认 15 分钟用例上限会掩盖「元素缺失时 action 无限等待」
// 这类问题（实测曾卡满 15m），因此收紧上限并把 action 超时显式设为 5s。
test.describe.configure({ timeout: 120_000 });
test.use({ actionTimeout: 5_000 });

async function openDemo(page: Page, theme: "light" | "dark" = "light") {
  await page.addInitScript(
    (preference: string) => {
      window.localStorage.setItem("geist-docs-language", "en-US");
      window.localStorage.setItem("geist-theme-preference", preference);
    },
    theme,
  );
  await page.goto("/#/components/edit-menu");
  await page.waitForSelector(CONTAINER);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  });
}

/**
 * 先给一次真实指针交互（点击 / tap）。
 *
 * 组件用 `pointerOpenedRef` 区分「指针产生的选区」与「键盘产生的选区」，只有后者抢焦点；
 * 而**完全没有任何交互**的程序化选区会让胶囊走「抢焦点 + 还原选区」路径，其与浏览器选区
 * 状态的时序在自动化环境下会抖动（实测同一段选区先开后收，见交付书 §9）。
 * 真实用户必然先有指针 / 键盘交互，故这里显式补上。
 */
async function primePointerInteraction(page: Page, mode: "mouse" | "touch") {
  const box = await page.locator(PARAGRAPH).first().boundingBox();
  expect(box).not.toBeNull();
  const point = { x: box!.x + 20, y: box!.y + box!.height - 8 };
  if (mode === "touch") {
    await page.touchscreen.tap(point.x, point.y);
  } else {
    await page.mouse.click(point.x, point.y);
  }
  await page.waitForTimeout(250);
}

/** 在容器内造出真实文本选区（tap / 点击本身不会选中文字） */
async function selectTextRange(page: Page, start: number, end: number) {
  await page.evaluate(
    ({ start: from, end: to }) => {
      const paragraph = document.querySelector('[data-slot="edit-menu"] p');
      const textNode = paragraph?.firstChild;
      if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
        throw new Error("edit-menu demo paragraph text node not found");
      }
      const range = document.createRange();
      range.setStart(textNode, from);
      range.setEnd(textNode, to);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    },
    { start, end },
  );
}

async function capsuleAction(page: Page, label: string) {
  return page.locator(`${CAPSULE} button`).filter({ hasText: new RegExp(`^${label}$`) });
}

/**
 * 记录胶囊状态迁移；用于断言「真实 tap 之后胶囊从未退场」。
 * 每次用例重新安装，状态随页面结束丢弃（跨 worker/重试不共享）。
 */
async function installCapsuleStateRecorder(page: Page) {
  await page.evaluate((selector: string) => {
    const states: string[] = [];
    (window as unknown as { __capsuleStates: string[] }).__capsuleStates = states;
    const read = () => {
      const capsule = document.querySelector(selector);
      return capsule
        ? capsule.getAttribute("data-exiting") !== null
          ? "exiting"
          : "visible"
        : "absent";
    };
    let last = read();
    states.push(last);
    new MutationObserver(() => {
      const next = read();
      if (next !== last) {
        last = next;
        states.push(next);
      }
    }).observe(document.body, { childList: true, subtree: true, attributes: true });
  }, CAPSULE);
}

test.describe("HIG-AUD-020 touch race", () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 700 } });

  test("a real touch tap keeps the capsule open instead of flashing it away", async ({ page }) => {
    await openDemo(page);
    const paragraph = page.locator(PARAGRAPH).first();
    await paragraph.scrollIntoViewIfNeeded();
    await primePointerInteraction(page, "touch");
    await selectTextRange(page, 0, INITIAL_TEXT.length);
    await page.waitForTimeout(200);

    await expect(page.locator(CAPSULE)).toBeVisible();
    await installCapsuleStateRecorder(page);

    const box = await paragraph.boundingBox();
    expect(box).not.toBeNull();
    // 真实触屏 tap：浏览器会在此之后补发合成 mousedown / mouseup / click
    await page.touchscreen.tap(box!.x + 24, box!.y + 12);
    await page.waitForTimeout(700);

    const states = await page.evaluate(
      () => (window as unknown as { __capsuleStates: string[] }).__capsuleStates.slice(),
    );
    // 修复前实测为 ["visible", "exiting", ...]（退场后又被唤起 = 一闪即隐）
    expect(states).not.toContain("exiting");
    expect(states).not.toContain("absent");

    const capsule = page.locator(CAPSULE);
    await expect(capsule).toBeVisible();
    expect(await capsule.getAttribute("data-exiting")).toBeNull();

    // 020-b：容器与胶囊都抑制原生上下文菜单（callout 走 WebKit-only 属性，见文件头注释）
    const prevented = await page.evaluate((selector: string) => {
      const dispatch = (node: HTMLElement | null) => {
        if (!node) return null;
        const event = new MouseEvent("contextmenu", { bubbles: true, cancelable: true });
        node.dispatchEvent(event);
        return event.defaultPrevented;
      };
      return {
        container: dispatch(document.querySelector<HTMLElement>('[data-slot="edit-menu"]')),
        capsule: dispatch(document.querySelector<HTMLElement>(selector)),
      };
    }, CAPSULE);
    expect(prevented.container).toBe(true);
    expect(prevented.capsule).toBe(true);

    // `-webkit-touch-callout` 是 WebKit 私有属性：Blink 会把声明整体丢弃（计算值与
    // CSSOM 都取不到），但 Tailwind 只有成功解析该任意属性才会发射这个类选择器，
    // 因此以「选择器已编译进样式表」作为本机可得的证据；真机表现见交付书 §9。
    const calloutRule = await page.evaluate(() => {
      for (const sheet of Array.from(document.styleSheets)) {
        let rules: CSSRuleList | null = null;
        try {
          rules = sheet.cssRules;
        } catch {
          continue;
        }
        for (const rule of Array.from(rules ?? [])) {
          if (rule.cssText.includes("-webkit-touch-callout")) return rule.cssText;
        }
      }
      return null;
    });
    expect(calloutRule).toContain("-webkit-touch-callout");
  });
});

test.describe("HIG-AUD-021 bottom clamp", () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 160 } });

  for (const theme of ["light", "dark"] as const) {
    test(`keeps the flipped capsule inside the viewport bottom edge (${theme})`, async ({
      page,
    }) => {
      await openDemo(page, theme);
      const paragraph = page.locator(PARAGRAPH).first();
      await paragraph.scrollIntoViewIfNeeded();
      // 把选区挪到「上方放不下（翻转下方）」且「下方也放不下（必须 clamp）」都成立的位置
      const setup = await paragraph.evaluate((node) => {
        const rect = node.getBoundingClientRect();
        const innerHeight = window.innerHeight;
        const desired = Math.max(0, (innerHeight - rect.height - 60 + 68) / 2);
        window.scrollBy(0, rect.top - desired);
        const moved = node.getBoundingClientRect();
        return { innerHeight, paragraphTop: moved.top, paragraphBottom: moved.bottom };
      });
      // 前置条件自证：上方放不下（< 胶囊 52 + 间距 8 + 边距 8）且下方放不下
      expect(setup.paragraphTop).toBeLessThan(68);
      expect(setup.paragraphBottom + 60).toBeGreaterThan(setup.innerHeight - 8);

      await primePointerInteraction(page, "touch");
      await selectTextRange(page, 0, INITIAL_TEXT.length);
      await page.waitForTimeout(400);
      await expect(page.locator(CAPSULE)).toBeVisible();

      const geometry = await page.evaluate(
        ({ selector, paragraphSelector }) => {
          const capsule = document.querySelector<HTMLElement>(selector);
          if (!capsule) return null;
          const rect = capsule.getBoundingClientRect();
          const selection = document
            .querySelector(paragraphSelector)!
            .getBoundingClientRect();
          return {
            placement: capsule.getAttribute("data-placement"),
            declaredTop: Number.parseFloat(capsule.style.top),
            height: rect.height,
            bottom: rect.bottom,
            selectionBottom: selection.bottom,
            innerHeight: window.innerHeight,
          };
        },
        { selector: CAPSULE, paragraphSelector: PARAGRAPH },
      );

      expect(geometry).not.toBeNull();
      expect(geometry!.placement).toBe("bottom");
      // 胶囊完整落在视口内（安全边距 8px）
      expect(geometry!.bottom).toBeLessThanOrEqual(geometry!.innerHeight - 8 + 0.5);
      // 确实被 clamp：未 clamp 时会是 selectionBottom + 8（实测 165.66 > 152.5 溢出）
      expect(geometry!.declaredTop).toBeLessThan(geometry!.selectionBottom + 8);
      expect(geometry!.declaredTop).toBeCloseTo(geometry!.innerHeight - geometry!.height - 8, 0);
    });
  }
});

test.describe("HIG-AUD-021 clipboard contract", () => {
  test.use({ viewport: { width: 900, height: 800 } });

  test("cut removes exactly the visible selection and copies the raw text", async ({ page }) => {
    await openDemo(page);
    await page.locator(PARAGRAPH).first().scrollIntoViewIfNeeded();
    await primePointerInteraction(page, "mouse");
    // " any words"（含前导空格）→ 已 trim = "any words"
    await selectTextRange(page, 6, 16);
    await expect(page.locator(CAPSULE)).toBeVisible();

    await (await capsuleAction(page, "Cut")).click();
    await page.waitForTimeout(200);

    // 注：剪贴板**载荷**（写入选区原文）由单测断言 `copyTextToClipboard` 的入参；
    // 浏览器侧不做 `navigator.clipboard.readText()`（文档未获焦时会挂起，实测卡满用例上限）。
    // 删除用原文：剩余文本不含双空格（用已 trim 文本会残留首尾空白）
    const text = await page.locator(PARAGRAPH).first().textContent();
    expect(text).toBe("Select in this sentence to reveal the floating edit capsule above the selection.");
    await expect(page.locator(LOG_LINE)).toContainText("Cut 9 characters.");
  });

  test("a blocked clipboard keeps the text and reports visible feedback", async ({ page }) => {
    await page.addInitScript(() => {
      // 模拟剪贴板不可用：Clipboard API 与 execCommand 兜底都失败
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: () => Promise.reject(new Error("clipboard blocked")) },
      });
      document.execCommand = () => false;
    });
    await openDemo(page);
    await page.locator(PARAGRAPH).first().scrollIntoViewIfNeeded();
    await primePointerInteraction(page, "mouse");
    await selectTextRange(page, 0, INITIAL_TEXT.length);
    await expect(page.locator(CAPSULE)).toBeVisible();

    await (await capsuleAction(page, "Cut")).click();
    await page.waitForTimeout(200);

    // 数据不丢失：onCut 未被调用 → 文本原样保留；且失败有可见反馈
    await expect(page.locator(PARAGRAPH).first()).toHaveText(INITIAL_TEXT);
    await expect(page.locator(LOG_LINE)).toContainText("Clipboard write is blocked");
  });
});
