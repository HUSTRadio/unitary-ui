/**
 * 官方浮层箭头 path（14×7，底边方肩 buffer 用于覆盖卡片边框，由调用方 CSS 定位）。
 * tooltip 与 context-card 共享同一 path 数据；SVG path 禁止手改（项目约定），单点存放避免双维护漂移。
 * 各消费方自行决定 fill / stroke 变量（tooltip → --tooltip-*；context-card → --context-card-tip-stroke）。
 */
export const TIP_ARROW_PATH =
  "M15 -0.5V0.5H12.9834L12.8184 0.508789C12.4377 0.550822 12.0853 0.738056 11.8359 1.03418L8.53027 4.95996C7.73114 5.90893 6.26886 5.90892 5.46973 4.95996L2.16406 1.03418C1.87905 0.695733 1.45907 0.5 1.0166 0.5H-1V-0.5H15Z";
