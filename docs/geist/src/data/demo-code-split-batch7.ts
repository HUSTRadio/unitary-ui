/**
 * 组件 demo 区块的独立源码（Show code 折叠展开显示）— split batch 7。
 *
 * 覆盖组件：destructive-action-modal（官方 4 区块：Default / Reversible / Loading / With error）。
 *
 * 结构：DEMO_CODE_SPLIT_BATCH7[组件 slug][区块 blockId] = 该区块的完整 TSX 源码。
 * blockId 与官方快照 docs/geist-markdown-refs/components/destructive-action-modal.md
 * 的「## 区块标题」原文一致（Default / Reversible / Loading / With error）。
 * 源码反映本地组件实际 API（import 路径 @/components/ui/*，prop 为本地实现子集）。
 *
 * 填充约定：
 * - 每段源码含 import + 该区块的完整用法（官方 demo 代码映射到本地 API）。
 * - 官方 import @vercel/geistcn/components 拆分为 @/components/ui/button 与
 *   @/components/ui/destructive-action-modal 两条；官方 demo 未使用图标，故无 lucide-react。
 * - 含 useState 的区块保留 export function Component() 包装（本组件 4 区块均含 useState）。
 * - 官方 prop 本地已全部实现（open / onCancel / onConfirm / title / description /
 *   confirmLabel / verificationPhrase / verificationLabel / irreversibleDescription /
 *   loading / error），无省略项。
 * - Button 官方 size="small" variant="error" 映射为本地 size="small" type="error"
 *   （本地视觉变体 prop 为 type），并按本地约定补 typeName="button"。
 */

export const DEMO_CODE_SPLIT_BATCH7: Record<string, Record<string, string>> = {
  "destructive-action-modal": {
    Default: `import { Button } from "@/components/ui/button";
import { DestructiveActionModal } from "@/components/ui/destructive-action-modal";
import { useState } from "react";

export function Component() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 1500);
  };

  return (
    <>
      <Button typeName="button" type="error" size="small" onClick={() => setOpen(true)}>
        Delete Project
      </Button>
      <DestructiveActionModal
        confirmLabel="Delete Project"
        description={
          <>
            <span className="font-medium">next-year-boilerplate</span> and all its deployments,
            domains, and environment variables will be permanently deleted.
          </>
        }
        irreversibleDescription="Deleting next-year-boilerplate cannot be undone."
        loading={loading}
        onCancel={() => setOpen(false)}
        onConfirm={handleConfirm}
        open={open}
        title="Delete Project"
        verificationLabel="project name"
        verificationPhrase="next-year-boilerplate"
      />
    </>
  );
}`,
    Reversible: `import { Button } from "@/components/ui/button";
import { DestructiveActionModal } from "@/components/ui/destructive-action-modal";
import { useState } from "react";

export function Component() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button typeName="button" type="error" size="small" onClick={() => setOpen(true)}>
        Disable Vercel Authentication
      </Button>
      <DestructiveActionModal
        confirmLabel="Disable Vercel Authentication"
        description="Anyone will be able to view your deployments without being a member of your team."
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        open={open}
        title="Disable Vercel Authentication"
        verificationPhrase="disable vercel authentication"
      />
    </>
  );
}`,
    Loading: `import { Button } from "@/components/ui/button";
import { DestructiveActionModal } from "@/components/ui/destructive-action-modal";
import { useState } from "react";

export function Component() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button typeName="button" type="error" size="small" onClick={() => setOpen(true)}>
        Delete Project
      </Button>
      <DestructiveActionModal
        confirmLabel="Delete Project"
        description="my-project and all its deployments will be permanently deleted."
        irreversibleDescription="Deleting my-project cannot be undone."
        loading
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          /* no-op while loading */
        }}
        open={open}
        title="Delete Project"
        verificationLabel="project name"
        verificationPhrase="my-project"
      />
    </>
  );
}`,
    "With error": `import { Button } from "@/components/ui/button";
import { DestructiveActionModal } from "@/components/ui/destructive-action-modal";
import { useState } from "react";

export function Component() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button typeName="button" type="error" size="small" onClick={() => setOpen(true)}>
        Delete Project
      </Button>
      <DestructiveActionModal
        confirmLabel="Delete Project"
        description="my-project and all its deployments will be permanently deleted."
        error="Couldn’t delete project. Try again."
        irreversibleDescription="Deleting my-project cannot be undone."
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        open={open}
        title="Delete Project"
        verificationLabel="project name"
        verificationPhrase="my-project"
      />
    </>
  );
}`,
  },
};
