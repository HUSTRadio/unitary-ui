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
const EDIT_TOOLBAR = `${CAPSULE}[data-presentation="capsule"]`;
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
      window.localStorage.setItem("unitary-docs-language", "en-US");
      window.localStorage.setItem("unitary-theme-preference", preference);
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

    await expect(page.locator(EDIT_TOOLBAR)).toHaveAttribute("role", "toolbar");
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

    const capsule = page.locator(EDIT_TOOLBAR);
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
      const setup = await paragraph.evaluate(async (node) => {
        const rect = node.getBoundingClientRect();
        const innerHeight = window.innerHeight;
        const desired = Math.max(0, (innerHeight - rect.height - 60 + 68) / 2);
        // 文档正文独立滚动；滚动 window 无法把选区移到上下方均不足的边界位置。
        const scrollOwner = node.closest<HTMLElement>("#main-content");
        if (!scrollOwner) throw new Error("EditMenu demo has no docs scroll owner");
        scrollOwner.scrollTop += rect.top - desired;
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        );
        const moved = node.getBoundingClientRect();
        return { innerHeight, paragraphTop: moved.top, paragraphBottom: moved.bottom };
      });
      // 前置条件自证：上方放不下（< 胶囊 52 + 间距 8 + 边距 8）且下方放不下
      expect(setup.paragraphTop).toBeLessThan(68);
      expect(setup.paragraphBottom + 60).toBeGreaterThan(setup.innerHeight - 8);

      await primePointerInteraction(page, "touch");
      await selectTextRange(page, 0, INITIAL_TEXT.length);
      await page.waitForTimeout(400);
      await expect(page.locator(EDIT_TOOLBAR)).toBeVisible();

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

test.describe("EditMenu horizontal selection toolbar (HIG-AUD-036 product decision)", () => {
  test.use({ viewport: { width: 900, height: 800 } });

  test("mouse selection opens a horizontal keyboard-operable toolbar in both themes", async ({ page }) => {
    for (const theme of ["light", "dark"] as const) {
      await openDemo(page, theme);
      await page.locator(PARAGRAPH).first().scrollIntoViewIfNeeded();
      await primePointerInteraction(page, "mouse");
      await selectTextRange(page, 7, 16);
      const menu = page.locator(EDIT_TOOLBAR);
      await expect(menu).toHaveAttribute("role", "toolbar");
      await expect(menu).toHaveAttribute("aria-orientation", "horizontal");
      const first = menu.getByRole("button", { name: "Cut" });
      await first.focus();
      await page.keyboard.press("ArrowRight");
      await expect(menu.getByRole("button", { name: "Copy" })).toBeFocused();
      const geometry = await menu.evaluate((node) => {
        const rect = node.getBoundingClientRect();
        const firstItem = node.querySelector("button")!.getBoundingClientRect();
        const secondItem = node.querySelectorAll("button")[1].getBoundingClientRect();
        return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom,
          firstX: firstItem.x, secondX: secondItem.x, firstY: firstItem.y, secondY: secondItem.y,
          viewportWidth: innerWidth, viewportHeight: innerHeight };
      });
      expect(geometry.secondX).toBeGreaterThan(geometry.firstX);
      expect(Math.abs(geometry.secondY - geometry.firstY)).toBeLessThanOrEqual(1);
      // 缩放入场的亚像素取整会让 8px 边距短暂显示为 7.98px。
      expect(geometry.left).toBeGreaterThanOrEqual(7.5);
      expect(geometry.right).toBeLessThanOrEqual(geometry.viewportWidth - 7.5);
      expect(geometry.top).toBeGreaterThanOrEqual(7.5);
      expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewportHeight - 7.5);
      await page.keyboard.press("Escape");
      await expect(menu).toHaveCount(0);
    }
  });
});

test.describe("HIG-AUD-021 clipboard contract", () => {
  test.use({ viewport: { width: 900, height: 800 } });

  test("cut removes exactly the visible selection and copies the raw text", async ({ page }) => {
    await openDemo(page);
    await page.locator(PARAGRAPH).first().scrollIntoViewIfNeeded();
    await primePointerInteraction(page, "mouse");
    // " any words"（含前导空格）→ 已 trim = "any words"
    await selectTextRange(page, 6, 16);
    await expect(page.locator(EDIT_TOOLBAR)).toHaveAttribute("role", "toolbar");
    await expect(page.locator(`${EDIT_TOOLBAR} button`)).toHaveCount(6);

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
    await expect(page.locator(EDIT_TOOLBAR)).toBeVisible();

    await (await capsuleAction(page, "Cut")).click();
    await page.waitForTimeout(200);

    // 数据不丢失：onCut 未被调用 → 文本原样保留；且失败有可见反馈
    await expect(page.locator(PARAGRAPH).first()).toHaveText(INITIAL_TEXT);
    await expect(page.locator(LOG_LINE)).toContainText("Clipboard write is blocked");
  });
});

test.describe("HIG-AUD-034 退场动画必须播完再卸载", () => {
  test.use({ viewport: { width: 900, height: 800 } });

  /**
   * 本条审计的原始表述是「关闭时节点瞬间消失，退场无从播放」。修复后组件用
   * `displaySelection` + `exiting` 让节点多驻留一个时长档（`CAPSULE_EXIT_MS`）再卸载。
   * 这里断言的是**过程**而不是终态：必须先经过 `exiting`（且带退场类）再变 `absent`，
   * 否则「驻留」形同虚设——只断言最终消失会漏掉瞬间卸载的回归。
   */
  test("关闭时先驻留一个动画档（可观测 data-exiting），再卸载", async ({ page }) => {
    await openDemo(page);
    await page.locator(PARAGRAPH).first().scrollIntoViewIfNeeded();
    await primePointerInteraction(page, "mouse");
    await selectTextRange(page, 0, 12);
    const capsule = page.locator(EDIT_TOOLBAR);
    await expect(capsule).toBeVisible();
    await expect(capsule).not.toHaveAttribute("data-exiting", "");

    // 在页面内用 MutationObserver 记录状态时间线：页面轮询的粒度拿不到 150ms 级的驻留
    await page.evaluate((selector) => {
      const record = { states: [] as string[], start: 0, end: 0, exitClasses: "" };
      (window as unknown as { __exitRecord: typeof record }).__exitRecord = record;
      const read = () => {
        const node = document.querySelector(selector);
        if (!node) return "absent";
        return node.getAttribute("data-exiting") !== null ? "exiting" : "visible";
      };
      record.states.push(read());
      const observer = new MutationObserver(() => {
        const state = read();
        if (state === record.states[record.states.length - 1]) return;
        record.states.push(state);
        if (state === "exiting") {
          record.start = performance.now();
          const node = document.querySelector(selector);
          record.exitClasses = node instanceof HTMLElement ? node.className : "";
        }
        if (state === "absent") {
          record.end = performance.now();
          observer.disconnect();
        }
      });
      observer.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["data-exiting"],
      });
    }, EDIT_TOOLBAR);

    await page.keyboard.press("Escape");
    await expect(capsule).toHaveCount(0);

    const record = await page.evaluate(
      () =>
        (window as unknown as {
          __exitRecord: { states: string[]; start: number; end: number; exitClasses: string };
        }).__exitRecord,
    );

    expect(record.states).toContain("exiting");
    expect(record.states[record.states.length - 1]).toBe("absent");
    // 退场类必须真的落在节点上（动画播放的前提），且退场期间不拦截新选区
    expect(record.exitClasses).toContain("animate-out");
    expect(record.exitClasses).toContain("pointer-events-none");
    // 驻留≈一个时长档（150ms）；放宽到区间以容忍定时器与调度抖动，但仍能拦住「瞬间卸载」
    const residency = record.end - record.start;
    expect(residency).toBeGreaterThanOrEqual(100);
    expect(residency).toBeLessThanOrEqual(600);
  });
});

test.describe("HIG-AUD-029 可见视口（软键盘 / 双指缩放）", () => {
  /**
   * 软键盘弹起与双指缩放改变的是**视觉视口**：布局视口（`window.inner*`）不变、
   * `window` 也不一定派发 `resize`，只订阅布局视口的浮层会停在旧位置。
   *
   * 伪造方式：`visualViewport` 在 Chromium 中是只读的，Playwright 无法直接改写其度量，
   * 因此在页面脚本执行前用访问器属性替换为可控实现（宽度用 getter，避免 init 脚本
   * 早于移动端仿真生效时读到布局视口的临时值）。
   */
  async function installVisualViewport(
    page: Page,
    bounds: { left: number; top: number; width: number; height: number },
  ) {
    await page.addInitScript((value: { left: number; top: number; width: number; height: number }) => {
      Object.defineProperty(window, "visualViewport", {
        configurable: true,
        value: {
          offsetLeft: value.left,
          offsetTop: value.top,
          get width() {
            return value.width;
          },
          get height() {
            return value.height;
          },
          scale: 1,
          addEventListener() {},
          removeEventListener() {},
        },
      });
    }, bounds);
  }

  /** 打开示例并造出选区、等胶囊出现；返回容器段落。 */
  async function revealCapsule(page: Page, mode: "mouse" | "touch") {
    const paragraph = page.locator(PARAGRAPH).first();
    await paragraph.scrollIntoViewIfNeeded();
    await primePointerInteraction(page, mode);
    await selectTextRange(page, 0, INITIAL_TEXT.length);
    await expect(page.locator(EDIT_TOOLBAR)).toBeVisible();
    return paragraph;
  }

  test.describe("软键盘弹起", () => {
    test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 700 } });

    for (const theme of ["light", "dark"] as const) {
      test(`视觉视口变化后胶囊收起，不停留在旧位置（${theme}）`, async ({ page }) => {
        await openDemo(page, theme);
        await revealCapsule(page, "touch");

        // 修复前实测：胶囊对视觉视口信号毫无反应（仍在 count 1），位置停留在旧视口。
        await page.evaluate(() => {
          window.visualViewport?.dispatchEvent(new Event("resize"));
        });

        await expect(page.locator(EDIT_TOOLBAR)).toHaveCount(0);
      });
    }

    test("双指缩放（视觉视口 scroll）同样收起胶囊", async ({ page }) => {
      await openDemo(page);
      await revealCapsule(page, "touch");

      await page.evaluate(() => {
        window.visualViewport?.dispatchEvent(new Event("scroll"));
      });

      await expect(page.locator(EDIT_TOOLBAR)).toHaveCount(0);
    });
  });

  test.describe("双指缩放后定位", () => {
    test.use({ viewport: { width: 900, height: 800 } });

    /**
     * 模拟放大后只看得见右半边：布局视口仍是 900×800，可见区只有 391×600
     * （等于 scale≈2.3 时的 `900 / scale`，且被平移到右侧）。
     * 选区中心落在可见区左侧之外，因此水平 clamp 的**边界**决定胶囊最终位置——
     * 用布局视口宽度算的旧实现会把胶囊放到可见区左边（用户看不到）。
     */
    test("胶囊被 clamp 进可见区，而不是按布局视口宽度定位", async ({ page }) => {
      const visible = { left: 500, top: 100, width: 391, height: 600 };
      await installVisualViewport(page, visible);
      await openDemo(page);
      await revealCapsule(page, "mouse");
      // 入场动画（`zoom-in-95`）期间节点的 transform 由动画接管、宽度也未落定，
      // 与 HIG-AUD-021 段同样的口径：等一个动画档再量最终几何。
      await page.waitForTimeout(400);

      const geometry = await page.locator(CAPSULE).evaluate((node) => {
        const rect = node.getBoundingClientRect();
        return {
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom,
          width: rect.width,
          declaredLeft: Number.parseFloat((node as HTMLElement).style.left),
        };
      });

      // 胶囊完整落在可见区内（安全边距 8px，容忍缩放动画的亚像素取整）
      expect(geometry.left).toBeGreaterThanOrEqual(visible.left + 7.5);
      expect(geometry.right).toBeLessThanOrEqual(visible.left + visible.width - 7.5);
      expect(geometry.top).toBeGreaterThanOrEqual(visible.top + 7.5);
      expect(geometry.bottom).toBeLessThanOrEqual(visible.top + visible.height - 7.5);
      // 且确实由可见区左缘 clamp 而来（居中会被推到这里之外）
      expect(geometry.declaredLeft).toBeCloseTo(visible.left + geometry.width / 2 + 8, 0);
    });
  });
});
