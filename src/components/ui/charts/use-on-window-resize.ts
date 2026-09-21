// Tremor Raw · useOnWindowResize [v0.0.2] —— 源码内置自 github.com/tremorlabs/tremor（Apache-2.0，© Tremor contributors）
// 本地适配：无。

import * as React from "react"

export const useOnWindowResize = (handler: () => void) => {
  React.useEffect(() => {
    const handleResize = () => {
      handler()
    }
    handleResize()
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [handler])
}
