// Build-only entry: consumers import styles.css explicitly.
import "../styles/index.css";

import { installFontMetrics } from "./font-metrics";

// 字体度量自动初始化（M1-01）：由入口显式安装，替代 font-metrics 模块的
// 加载副作用。Node/SSR 导入时 installFontMetrics 内部直接返回，无 DOM 访问。
installFontMetrics();

export * from "./index";
