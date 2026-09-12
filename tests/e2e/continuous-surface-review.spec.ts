import { expect, test } from "@playwright/test";

test("unsupported path() retains the circular fallback", async ({ page }) => {
  await page.addInitScript(() => {
    const supports = CSS.supports.bind(CSS);
    CSS.supports = (property: string, value?: string) => property === "clip-path"
      ? false : value === undefined ? supports(property) : supports(property, value);
  });
  await page.goto("/#/components/continuous-surface");
  const surface = page.locator('[data-slot="continuous-surface"][data-curve="3"]');
  await expect(surface).toBeVisible();
  await expect(surface).toHaveCSS("border-radius", "24px");
  await expect(surface).toHaveCSS("clip-path", "none");
});

async function openSurface(page: import("@playwright/test").Page) {
  await page.goto("/#/components/continuous-surface");
  const surface = page.locator('[data-slot="continuous-surface"][data-curve="3"]');
  await expect(surface).toBeVisible();
  await expect.poll(() => surface.evaluate((el) => getComputedStyle(el).clipPath)).toContain("path(");
  return surface;
}

test("continuous background paints outside the circular fallback", async ({ page }) => {
  const surface = await openSurface(page);
  await surface.evaluate((el) => {
    Object.assign((el as HTMLElement).style, { background: "rgb(255, 0, 0)", border: "0" });
    Object.assign((el.parentElement as HTMLElement).style, { background: "white", boxShadow: "none" });
  });
  const png = await surface.screenshot();
  const pixel = await page.evaluate(async (base64) => {
    const image = new Image();
    image.src = `data:image/png;base64,${base64}`;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d")!;
    context.drawImage(image, 0, 0);
    return [...context.getImageData(6, 6, 1, 1).data];
  }, png.toString("base64"));
  // r=24: (6,6) lies inside p=3 but outside the p=2 background radius.
  expect(pixel[0]).toBe(255);
  expect(pixel[1]).toBeLessThan(30);
  expect(pixel[2]).toBeLessThan(30);
});

test("clip path uses local border-box dimensions under ancestor transforms", async ({ page }) => {
  const surface = await openSurface(page);
  await surface.evaluate((el) => {
    (el.parentElement as HTMLElement).style.transform = "scale(0.5)";
    Object.assign((el as HTMLElement).style, { width: "200px", height: "100px", boxSizing: "border-box", border: "4px solid red" });
  });
  await expect.poll(() => surface.evaluate((el) => getComputedStyle(el).clipPath)).toContain("L 176 0");
  // Border-only changes must trigger the observer too (content-box stays constant).
  await surface.evaluate((el) => {
    Object.assign((el as HTMLElement).style, { boxSizing: "content-box", width: "160px", height: "80px", padding: "0", borderWidth: "10px" });
  });
  await expect.poll(() => surface.evaluate((el) => getComputedStyle(el).clipPath)).toContain("L 156 0");
  await surface.evaluate((el) => { (el as HTMLElement).style.borderWidth = "15px"; });
  await expect.poll(() => surface.evaluate((el) => getComputedStyle(el).clipPath)).toContain("L 166 0");
});

test("superellipse demo clips in proportional coordinates at every tile size", async ({ page }) => {
  await openSurface(page);
  const tile = page.locator('[data-curve="superellipse"]');
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await tile.scrollIntoViewIfNeeded();
    const hits = await tile.evaluate((el) => {
      const r = el.getBoundingClientRect();
      const hit = (x: number, y: number) => {
        const node = document.elementFromPoint(r.left + r.width * x, r.top + r.height * y);
        return node === el || (node !== null && el.contains(node));
      };
      return { center: hit(0.5, 0.5), right: hit(0.98, 0.5), corner: hit(0.99, 0.01) };
    });
    expect(hits).toEqual({ center: true, right: true, corner: false });
  }
});

test("superellipse shadow follows the clipped silhouette from the wrapper, not the wrapper box", async ({ page }) => {
  await openSurface(page);
  const tile = page.locator('[data-curve="superellipse"]');
  await tile.scrollIntoViewIfNeeded();
  // 阴影必须由外层包装的 drop-shadow 生成（它跟随被裁切子元素的实际 alpha）；
  // 包装上的 box-shadow 画的是包装自己的圆角矩形，与超椭圆轮廓脱节。
  // 挂在被裁切的同一元素上同样不行：clip-path 会连 filter 一起裁掉。
  const readStyles = () =>
    tile.evaluate((el) => {
      const self = getComputedStyle(el);
      const wrapper = getComputedStyle(el.parentElement as HTMLElement);
      const tileBox = el.getBoundingClientRect();
      const wrapperBox = (el.parentElement as HTMLElement).getBoundingClientRect();
      return {
        wrapperFilter: wrapper.filter,
        wrapperBoxShadow: wrapper.boxShadow,
        selfFilter: self.filter,
        selfClipPath: self.clipPath,
        tileWidth: tileBox.width,
        tileHeight: tileBox.height,
        wrapperWidth: wrapperBox.width,
      };
    });
  await expect.poll(async () => (await readStyles()).wrapperFilter).toContain("drop-shadow(");
  const styles = await readStyles();
  expect(styles.wrapperBoxShadow).toBe("none");
  expect(styles.selfFilter).toBe("none");
  expect(styles.selfClipPath).not.toBe("none");
  // 磁贴是 1:1、包装是 4:3，两者底片不重合 —— 包装上的 box-shadow 会露在两侧留白处，
  // 这正是本契约要防的回归；若两者同形，本用例就区分不出两种投影了。
  expect(Math.abs(styles.tileWidth - styles.tileHeight)).toBeLessThan(2);
  expect(styles.wrapperWidth).toBeGreaterThan(styles.tileWidth + 20);
});
