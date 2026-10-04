# 配色 API

> Route: `/api/color-schemes`

# Color Scheme API

通过现有 token 体系，将命名 UI 配色和独立代码主题应用到明确的 DOM 容器。

[打开交互配色展示 →](#/color-schemes)

## 注册表与解析

COLOR\_SCHEMES 包含 default、unitary-blue、green、amber；CODE\_THEMES 包含 default、light、dark、monokai、solarized-light、solarized-dark。注册表被冻结。getColorScheme(id) 与 getCodeTheme(id) 返回条目，未知 ID 抛出 TypeError。

resolveCodeTheme(theme, scheme, mode) 返回新的 mode、tokens、colors、syntax；getInlineCodeColors(theme, scheme, mode) 返回 foreground、background、border。固定代码主题保持自己的明暗，Default 跟随指定 UI 配色与明暗。这些纯函数可在无 document 环境调用。

```tsx
const ui = getColorScheme("green");
const theme = getCodeTheme("monokai");
const { mode, colors } = resolveCodeTheme(theme, ui, "light");
// mode === "dark", colors.number === "#ae81ff"
```

## 应用与恢复

applyColorScheme(target, {scheme = 'default', mode}) 应用 UI 配色。applyCodeTheme(target, {theme = 'default', scheme = 'default', mode, kind = 'block'}) 应用代码块主题，kind: 'inline' 时只设置三个行内角色。mode 必填且只能为 light 或 dark；kind 只能为 inline 或 block。二者返回可重复调用的恢复回调，null 目标用于尚未就绪的 ref 或服务端时安全地不写入。

目标须明确传入 HTMLElement 或 SVGElement，不会隐式选择全局根节点。重新应用前先恢复：回调恢复仍由本次应用持有的行内值、优先级与属性，保留后续外部修改及无关样式；不改变祖先主题，也不持久化偏好。

color-scheme.ts

```tsx
import { applyColorScheme, applyCodeTheme } from "@hustradio/unitary-ui";
import "@hustradio/unitary-ui/styles.css";

const restoreUI = applyColorScheme(frame, {
  scheme: "unitary-blue",
  mode: "light",
});
const restoreInline = applyCodeTheme(inlineContainer, {
  theme: "light",
  mode: "light",
  kind: "inline",
});
const restoreBlock = applyCodeTheme(blockContainer, {
  theme: "monokai",
  mode: "light",
});

// Restore before changing a selection or disposing the demo.
restoreBlock();
restoreInline();
restoreUI();
```

React 中在 effect 内应用到 refs，并返回清理回调。配色展示使用同一套公共 API。

```tsx
useLayoutEffect(() => {
  const restoreUI = applyColorScheme(frameRef.current, { scheme, mode });
  const restoreCode = applyCodeTheme(codeRef.current, {
    scheme,
    theme: blockTheme,
    mode,
  });
  return () => {
    restoreCode();
    restoreUI();
  };
}, [scheme, mode, blockTheme]);
```

## CSS 导出与边界

createColorSchemeCSS({scheme, inlineTheme, blockTheme}) 返回 UI 双主题、独立代码值、局部 alias 绑定与角色样式，三个选择项默认均为 default。按展示页的属性结构使用，并在库样式之后加载。未知注册表选项在修改容器前抛出异常。

```tsx
const css = createColorSchemeCSS({
  scheme: "unitary-blue",
  inlineTheme: "light",
  blockTheme: "monokai",
});
```

API 通过正常 DOM 继承与 SubFrame、层叠组件组合，不创建 iframe、Shadow DOM 或独立 React ThemeProvider。挂载在 body 的 portal 需要合适的局部容器才能继承配色。代码主题将公认编辑器颜色适配到 Prism 角色，不复制完整 TextMate 规则；主题来源和保存的 Default 配置见展示页。
