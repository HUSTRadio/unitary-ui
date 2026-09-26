import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * SubFrame — 局部浮层容器（local overlay frame）。
 *
 * 把「浮层该落在哪个坐标系里」从逐组件透传 container，收敛为一层上下文：
 * 渲染在 SubFrame 子树内的 BottomSheet / ExpandPanel / HamburgerMenu 会自动把浮层
 * 挂到最近的 SubFrame 上，而不是 document.body。这样 App Shell、设备预览、文档示例卡
 * 这类「页面中的页面」不需要各自手写 ref + container 接线。
 *
 * 语义：
 * - 定位：SubFrame 自身是 position:relative 的定位祖先，浮层以 absolute 贴合其
 *   padding box，因此边框会被自然扣除（遮罩不会盖住 1px 描边）。
 * - 裁剪：默认 overflow-clip，浮层不会溢出框架；需要溢出（tooltip 之类）时传 clip={false}。
 * - 尺寸：浮层改用框架的 client 尺寸换算档位比例与拖拽幅度，所以框架可以是任意大小的视窗。
 * - 嵌套：取最近的一个，内层覆盖外层。
 * - 退出：显式传 container={null} 可让某个浮层回到 document.body。
 */

const SubFrameContext = React.createContext<HTMLElement | null>(null);

/**
 * 读取最近的 SubFrame 元素（不在任何 SubFrame 内时返回 null）。
 * 供浮层组件解析默认 container 使用，不作为公开 API 导出。
 */
function useSubFrame(): HTMLElement | null {
  return React.useContext(SubFrameContext);
}

interface SubFrameProps extends React.ComponentPropsWithoutRef<"div"> {
  /** 是否裁剪超出框架的浮层。@default true */
  clip?: boolean;
}

const SubFrame = React.forwardRef<HTMLDivElement, SubFrameProps>(function SubFrame(
  { clip = true, className, children, ...rest },
  forwardedRef,
) {
  const [element, setElement] = React.useState<HTMLDivElement | null>(null);

  // 回调 ref：同一个节点同时交给外部 ref 与上下文，避免 ref / state 双源不同步
  const setRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      setElement(node);
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef],
  );

  return (
    <SubFrameContext.Provider value={element}>
      <div
        data-slot="sub-frame"
        {...rest}
        ref={setRef}
        className={cn("relative", clip && "overflow-clip", className)}
      >
        {children}
      </div>
    </SubFrameContext.Provider>
  );
});

export { SubFrame, useSubFrame };
export type { SubFrameProps };
