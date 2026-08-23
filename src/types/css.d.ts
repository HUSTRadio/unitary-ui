// Ambient 声明：让库内部 side-effect import 的 CSS 模块有类型
// 这些只用于类型检查，运行时由构建工具处理
declare module "*.css";
declare module "react-mockframe/styles/*.css";
