import { expect, test } from "@playwright/test";

test.describe("docs typography geometry", () => {
  test("stacks Introduction typeface names without wrapping or overflow", async ({ page }) => {
    await page.goto("/#/introduction");

    const oppo = page.getByText("OPPO Sans 4.0", { exact: true });
    const preview = oppo.locator("..");
    const names = preview.locator(":scope > div");

    await expect(names).toHaveCount(3);
    const boxes = await names.evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          text: element.textContent?.trim(),
          x: rect.x,
          y: rect.y,
          width: rect.width,
          scrollWidth: element.scrollWidth,
          writingMode: getComputedStyle(element).writingMode,
        };
      }),
    );

    expect(boxes.map(({ text }) => text)).toEqual([
      "OPPO Sans 4.0",
      "HarmonyOS Sans SC",
      "JetBrains Maple Mono",
    ]);
    expect(new Set(boxes.map(({ x }) => Math.round(x))).size).toBe(1);
    expect(boxes[0].y).toBeLessThan(boxes[1].y);
    expect(boxes[1].y).toBeLessThan(boxes[2].y);
    expect(boxes.every(({ width, scrollWidth }) => scrollWidth <= width + 1)).toBe(true);
    expect(boxes.every(({ writingMode }) => writingMode === "horizontal-tb")).toBe(true);
  });

  test("aligns unmarked Grid best-practice items with their heading", async ({ page }) => {
    await page.goto("/#/grid");

    const section = page.locator('[data-grid-demo="best-practices"]');
    const heading = section.locator("h2");
    const firstItem = section.locator("li").first();

    const [headingBox, itemBox] = await Promise.all([heading.boundingBox(), firstItem.boundingBox()]);
    expect(headingBox).not.toBeNull();
    expect(itemBox).not.toBeNull();
    expect(Math.abs(itemBox!.x - headingBox!.x)).toBeLessThanOrEqual(1);
    await expect(section.locator("ul")).toHaveCSS("list-style-type", "none");
  });

  test("keeps both typography fixes stable across the required viewport and theme matrix", async ({
    page,
  }) => {
    await page.goto("/#/introduction");
    for (const theme of ["light", "dark"] as const) {
      await page.evaluate((nextTheme) => {
        localStorage.setItem("geist-theme-preference", nextTheme);
      }, theme);
      await page.reload();
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto("/#/introduction");
        // hash 路由 + 客户端渲染：goto 返回时 React 可能尚未挂载，
        // 必先等目标内容出现，否则 evaluateAll 读到空数组造成假失败。
        await page.getByText("OPPO Sans 4.0", { exact: true }).waitFor();
        const names = page
          .getByText("OPPO Sans 4.0", { exact: true })
          .locator("..")
          .locator(":scope > div");
        const typefaceGeometry = await names.evaluateAll((elements) =>
          elements.map((element) => ({
            x: element.getBoundingClientRect().x,
            width: element.getBoundingClientRect().width,
            scrollWidth: element.scrollWidth,
          })),
        );
        expect(new Set(typefaceGeometry.map(({ x }) => Math.round(x))).size).toBe(1);
        expect(typefaceGeometry.every(({ width: boxWidth, scrollWidth }) => scrollWidth <= boxWidth + 1)).toBe(
          true,
        );

        await page.goto("/#/grid");
        const section = page.locator('[data-grid-demo="best-practices"]');
        await section.waitFor();
        const [headingBox, itemBox] = await Promise.all([
          section.locator("h2").boundingBox(),
          section.locator("li").first().boundingBox(),
        ]);
        expect(Math.abs(itemBox!.x - headingBox!.x)).toBeLessThanOrEqual(1);
      }
    }
  });
});

test.describe("Feedback official interaction and geometry", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/#/components/feedback");
  });

  test("default uses an anchored 340px Popover, restores focus and preserves a dismissed draft", async ({
    page,
  }) => {
    const trigger = page.locator('[data-demo-card="Default"] [data-slot="feedback-trigger"]');
    await expect(trigger).toBeVisible();
    await expect(page.locator('[data-slot="feedback-popup"]')).toHaveCount(0);

    await trigger.click();
    const popup = page.locator('[data-slot="feedback-popup"]');
    await expect(popup).toBeVisible();
    await expect
      .poll(async () => (await popup.boundingBox())?.width)
      .toBeGreaterThanOrEqual(339);
    expect((await popup.boundingBox())?.width).toBeLessThanOrEqual(341);
    expect(await page.locator("body").getAttribute("data-scroll-locked")).toBeNull();

    const textarea = popup.locator('[data-slot="feedback-textarea"]');
    await textarea.fill("Preserve this draft");
    await page.keyboard.press("Escape");
    await expect(popup).toHaveCount(0);
    await expect(trigger).toBeFocused();

    await trigger.click();
    await expect(
      page.locator('[data-slot="feedback-popup"] [data-slot="feedback-textarea"]'),
    ).toHaveValue("Preserve this draft");
  });

  test("opens above the trigger instead of covering the work below it, and settles at its declared width", async ({
    page,
  }) => {
    // 先把触发器滚到视口中部，保证上方有充足空间，避免把碰撞翻转误判为缺陷。
    const trigger = page.locator('[data-demo-card="Default"] [data-slot="feedback-trigger"]');
    await trigger.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -200));
    await trigger.click();
    const popup = page.locator('[data-slot="feedback-popup"]');
    await expect(popup).toBeVisible();
    // 等 zoom-in-95 入场动画结束，否则读到的是 scale(0.95) 的中间宽度（340*0.95=323）。
    await expect(page.locator("body")).toHaveCSS("overflow", "visible");
    await page.waitForTimeout(400);

    const [triggerBox, popupBox] = await Promise.all([trigger.boundingBox(), popup.boundingBox()]);
    expect(triggerBox).not.toBeNull();
    expect(popupBox).not.toBeNull();

    // 向上弹出：弹层底边位于触发器顶边之上（含 8px sideOffset）。
    expect((popupBox?.y ?? 0) + (popupBox?.height ?? 0)).toBeLessThanOrEqual((triggerBox?.y ?? 0) + 1);
    await expect(popup).toHaveAttribute("data-side", "top");

    // 动画结束后宽度必须等于声明值，且内容不被 overflow-hidden 裁切。
    expect(popupBox?.width).toBeGreaterThanOrEqual(339);
    expect(popupBox?.width).toBeLessThanOrEqual(341);
    const clipped = await popup.evaluate((node) => node.scrollWidth - node.clientWidth);
    expect(clipped).toBeLessThanOrEqual(1);
  });

  test("Inline expands in place, clears rating on dismissal and preserves its draft", async ({
    page,
  }) => {
    const capsule = page.locator('[data-demo-card="Inline"] [data-slot="rating-pill"]');
    const ratings = capsule.getByRole("radio");
    await expect(capsule).toHaveAttribute("data-state", "closed");
    const closedBox = await capsule.boundingBox();
    expect(closedBox?.height).toBe(48);
    // 收起态宽度由内容决定（label 永不截断），不再固定 274px。
    expect(closedBox?.width).toBeGreaterThanOrEqual(274);
    const label = capsule.locator('[data-slot="feedback-inline-header"] p');
    expect(await label.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);

    await ratings.last().click();
    await expect(capsule).toHaveAttribute("data-state", "open");
    // 浮动卡片向上生长：宽度 336px，header 在顶部、表单区在其下。
    const region = capsule.locator('[data-slot="feedback-form-region"]');
    await expect(region).toBeVisible();
    await expect.poll(async () => (await region.boundingBox())?.width).toBe(336);
    const [capsuleBox, regionBox, headerBox] = await Promise.all([
      capsule.boundingBox(),
      region.boundingBox(),
      capsule.locator('[data-slot="feedback-inline-header"]').boundingBox(),
    ]);
    // header 位于浮层顶部，表单区紧接其下（无缝）。
    expect((headerBox?.y ?? 0) - (capsuleBox?.y ?? 0)).toBeLessThanOrEqual(1);
    expect(Math.abs((regionBox?.y ?? 0) - ((headerBox?.y ?? 0) + (headerBox?.height ?? 0)))).toBeLessThanOrEqual(1);
    // header 仍是 48px 单行。
    expect(headerBox?.height).toBe(48);
    // 以收起胶囊的几何中心为水平原点：左右各扩展一半宽度差，中心偏移必须≈0。
    const openCenter = (capsuleBox?.x ?? 0) + (capsuleBox?.width ?? 0) / 2;
    const closedCenter = (closedBox?.x ?? 0) + (closedBox?.width ?? 0) / 2;
    expect(Math.abs(openCenter - closedCenter)).toBeLessThanOrEqual(1);
    const halfDelta = Math.abs(((capsuleBox?.width ?? 0) - (closedBox?.width ?? 0)) / 2);
    // 对称扩展：卡片左缘向左移 halfDelta（右缘向右移同样距离），中心不动。
    expect(Math.abs((closedBox?.x ?? 0) - (capsuleBox?.x ?? 0) - halfDelta)).toBeLessThanOrEqual(1);
    // 圆角过渡 150ms，必须轮询到稳定值，否则读到的是中间帧（如 12.08px）。
    await expect
      .poll(() => capsule.evaluate((node) => getComputedStyle(node).borderRadius))
      .toBe("12px");

    // 评分配色同样有过渡，轮询到稳定值再断言。
    const selected = ratings.last();
    await expect
      .poll(() => selected.evaluate((node) => getComputedStyle(node).backgroundColor))
      .toBe("rgb(224, 240, 255)");
    await expect
      .poll(() => selected.locator("path").first().evaluate((node) => getComputedStyle(node).fill))
      .toBe("rgb(0, 104, 214)");

    // 表情行必须贴住 header 的右内边距，不得在右侧留下大块空档。
    const rightGap = await capsule.evaluate((node) => {
      const header = node.querySelector('[data-slot="feedback-inline-header"]')!;
      const group = header.querySelector('[role="radiogroup"]')!;
      const style = getComputedStyle(header);
      return header.getBoundingClientRect().right - parseFloat(style.paddingRight) - group.getBoundingClientRect().right;
    });
    expect(rightGap).toBeLessThanOrEqual(1);

    const textarea = capsule.locator('[data-slot="feedback-textarea"]');
    await textarea.fill("Inline draft");
    await page.keyboard.press("Escape");
    await expect(capsule).toHaveAttribute("data-state", "closed");
    // 收起是宽高同步的非线性过渡：表单区常驻挂载，高度由 grid-rows 1fr→0fr 还原。
    const exiting = capsule.locator('[data-slot="feedback-form-region"]');
    await expect(exiting).toHaveAttribute("data-state", "closed");
    await expect(exiting).toHaveAttribute("aria-hidden", "true");
    expect(await exiting.evaluate((node) => getComputedStyle(node).transitionProperty)).toContain(
      "grid-template-rows",
    );
    // 过渡结束后高度回到 0 行，且卡片宽度/高度回到收起值。
    await expect
      .poll(() => exiting.evaluate((node) => getComputedStyle(node).gridTemplateRows))
      .toBe("0px");
    for (const radio of await ratings.all()) await expect(radio).toHaveAttribute("aria-checked", "false");

    // 文字草稿保留：表单区常驻挂载，直接读取即可。
    await expect(textarea).toHaveValue("Inline draft");

    // 收起后胶囊回到 48px 单行，且容器底部相对占位层不变（向上生长、底边不动）。
    // 用「占位层底边 - 胶囊底边」的相对偏移，避免受页面滚动影响。
    await expect.poll(async () => (await capsule.boundingBox())?.height).toBe(48);
    const collapsedOffset = await capsule.evaluate((node) => {
      const anchor = node.parentElement!;
      return anchor.getBoundingClientRect().bottom - node.getBoundingClientRect().bottom;
    });
    expect(Math.abs(collapsedOffset)).toBeLessThanOrEqual(1);
  });

  test("caps the floating Inline form width on narrow screens and honors reduced motion", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/#/components/feedback");
    const capsule = page.locator('[data-demo-card="Inline"] [data-slot="rating-pill"]');
    await capsule.getByRole("radio").last().click();
    const region = capsule.locator('[data-slot="feedback-form-region"]');
    await expect(region).toBeVisible();
    const box = await region.boundingBox();
    // 悬浮层受视口减 32px 上限约束，320 视口下不超过 288px。
    expect(box?.width).toBeLessThanOrEqual(288);
    // reduced motion：宽高/高度过渡全部禁用。
    expect(await region.evaluate((node) => getComputedStyle(node).transitionProperty)).toBe("none");
    expect(await capsule.evaluate((node) => getComputedStyle(node).transitionProperty)).toBe(
      "none",
    );
  });

  test("matches the measured selected colors in dark mode", async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem("geist-theme-preference", "dark");
    });
    await page.reload();
    const capsule = page.locator('[data-demo-card="Inline"] [data-slot="rating-pill"]');
    const selected = capsule.getByRole("radio").last();
    await selected.click();
    await expect
      .poll(() => selected.evaluate((node) => getComputedStyle(node).backgroundColor))
      .toBe("rgb(15, 47, 87)");
    await expect
      .poll(() =>
        selected.locator("path").first().evaluate((node) => getComputedStyle(node).fill),
      )
      .toBe("rgb(82, 168, 255)");
  });

  test("renders the six official demos and keeps select, metadata and adornment variants usable", async ({
    page,
  }) => {
    const demoIds = [
      "Default",
      "Inline",
      "Feedback with Select",
      "Feedback with metadata",
      "Feedback with prefix",
      "Feedback with suffix",
    ];
    for (const id of demoIds) await expect(page.locator(`[data-demo-card="${id}"]`)).toHaveCount(1);
    const localExtension = page.locator('[data-demo-card="Local RatingPill extension"]');
    await expect(localExtension).toHaveCount(1);
    await expect(localExtension.locator('[data-slot="rating-pill"]').first()).toHaveClass(
      /bg-success-soft/,
    );

   const selectCard = page.locator('[data-demo-card="Feedback with Select"]');
   await selectCard.locator('[data-slot="feedback-trigger"]').click();
   // 主题选择器已改为 Select 组件（Radix）：触发器是 [data-slot="select-trigger"]，选项以
   // role="option" 渲染在 portal 的 select-content 里，需要真实点击而非原生 selectOption。
   // 文档站默认 zh-CN，选项文案经框架 i18n 本地化（value=AI → label=人工智能）。
   const topicTrigger = page.locator('[data-slot="feedback-popup"] [data-slot="select-trigger"]');
   await topicTrigger.click();
   await page
     .locator('[data-slot="select-content"] [role="option"]', { hasText: "人工智能" })
     .click({ timeout: 5000 });
   await expect(topicTrigger).toContainText("人工智能");
   await page.keyboard.press("Escape");

    await expect(
      page.locator('[data-demo-card="Feedback with metadata"] [data-slot="feedback-trigger"]'),
    ).toBeVisible();
    await expect(page.locator('[data-demo-card="Feedback with prefix"] svg')).not.toHaveCount(0);
    await expect(page.locator('[data-demo-card="Feedback with suffix"] svg')).not.toHaveCount(0);
  });

  test("uses the compact localized footer label without clipping", async ({ page }) => {
    await page.goto("/#/grid");
    const footer = page.locator('[data-slot="feedback-anchor"] [data-slot="rating-pill"]');
    const label = footer.locator("p");
    await expect(label).toHaveText("提供反馈");
    expect(await label.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
  });

  test("centers the footer capsule horizontally in the pagination row", async ({ page }) => {
    await page.goto("/#/grid");
    const footer = page.locator('[data-slot="feedback-anchor"]');
    await expect(footer).toBeVisible();

    // feedback 列高度必须等于胶囊 48px：section 是 inline-flex，若父容器不是
    // flex 容器，行盒会给它额外加约 6px，使页脚比胶囊高一截且与左右分列不等高。
    const columnHeight = await footer.evaluate(
      (node) => node.parentElement!.getBoundingClientRect().height,
    );
    expect(columnHeight).toBe(48);

    // 占位层必须撑出真实宽度：否则它塌陷为 0 宽，父级中间列也塌成 0 宽，
    // 卡片只能从该点向右生长（此前实测偏右 111.5px）。
    const offset = await footer.evaluate((node) => {
      const pill = node.querySelector('[data-slot="rating-pill"]')!.getBoundingClientRect();
      const row = (node.closest("nav") ?? node.parentElement!).getBoundingClientRect();
      return pill.x + pill.width / 2 - (row.x + row.width / 2);
    });
    expect(Math.abs(offset)).toBeLessThanOrEqual(2);

    // 展开后仍应围绕同一中心对称扩展。
    await footer.getByRole("radio").last().click();
    await page.waitForTimeout(400);
    const openOffset = await footer.evaluate((node) => {
      const pill = node.querySelector('[data-slot="rating-pill"]')!.getBoundingClientRect();
      const row = (node.closest("nav") ?? node.parentElement!).getBoundingClientRect();
      return pill.x + pill.width / 2 - (row.x + row.width / 2);
    });
    expect(Math.abs(openOffset)).toBeLessThanOrEqual(2);
  });

  test("delivers the selected topic through onSubmit in a real browser submit", async ({ page }) => {
    const card = page.locator('[data-demo-card="Feedback with topics"]');
    await card.locator('[data-slot="feedback-trigger"]').click();
    const popup = page.locator('[data-slot="feedback-popup"]');
    // Radix Select：点开触发器后从 portal 的选项中点选。文档站默认 zh-CN，
    // label 为「账单」，但传给 onValueChange / onSubmit 的仍是 value "Billing"。
    await popup.locator('[data-slot="select-trigger"]').click();
    await page
      .locator('[data-slot="select-content"] [role="option"]', { hasText: "账单" })
      .click({ timeout: 5000 });
    await popup.locator('[role="radio"]').nth(2).click();
    await popup.locator('[data-slot="feedback-textarea"]').fill("Billing flow is clear");
    await popup.locator('button[type="submit"]').click();

    // 面板关闭即真实提交完成（非 dryRun），收据来自 onSubmit 实参。
    await expect(popup).toHaveCount(0);
    const receipt = card.locator('[data-slot="feedback-topics-receipt"]');
    await expect(receipt).toContainText("rating=okay");
    await expect(receipt).toContainText("topic=Billing");
    await expect(receipt).toContainText("text=Billing flow is clear");
    // topic 只走第 4 参，不会污染 metadata。
    await expect(receipt).toContainText("metadata={}");
  });

  test("keeps the inline capsule open when only the window loses focus", async ({ page }) => {
    await page.goto("/#/components/feedback");
    const capsule = page.locator('[data-demo-card="Inline"] [data-slot="rating-pill"]');
    await capsule.getByRole("radio").last().click();
    await expect(capsule).toHaveAttribute("data-state", "open");

    const textarea = capsule.locator('[data-slot="feedback-textarea"]');
    await textarea.fill("Window blur draft");

    // 只触发 window blur：焦点仍在 textarea 内，胶囊不应收起、评分不应被清空。
    await page.evaluate(() => window.dispatchEvent(new Event("blur")));
    await expect(capsule).toHaveAttribute("data-state", "open");
    await expect(capsule.getByRole("radio").last()).toHaveAttribute("aria-checked", "true");

    // 真实焦点外移仍然收起并清空评分。
    await page.locator("body").click({ position: { x: 5, y: 5 } });
    await expect(capsule).toHaveAttribute("data-state", "closed");
    for (const radio of await capsule.getByRole("radio").all()) {
      await expect(radio).toHaveAttribute("aria-checked", "false");
    }

    // 文字草稿保留：表单区常驻挂载，收起后直接读取。
    await expect(textarea).toHaveValue("Window blur draft");
  });
});