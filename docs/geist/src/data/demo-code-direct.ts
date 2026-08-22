/**
 * 直接渲染组件（官方单区块）的独立源码映射。
 * 结构：DEMO_CODE_DIRECT[组件 slug][区块 blockId] = 该区块完整 TSX。
 * blockId 用官方区块标题（banner/browser 等单区块组件）。
 */
export const DEMO_CODE_DIRECT: Record<string, Record<string, string>> = {
  banner: {
    Default: `import { Banner } from "@/components/ui/banner";

<Banner button={{ href: "#/components", content: "Read more" }}>
  <b>Big News</b> – New components finally available
</Banner>`,
  },
  browser: {
    Composition: `import { Browser } from "@/components/ui/browser";

<div className="w-full max-w-2xl">
  <Browser address="https://vercel.com">
    <div className="flex h-24 items-center justify-center bg-gray-alpha-100 text-copy-14 text-muted-foreground">
      Screenshot or demo content
    </div>
  </Browser>
</div>`,
  },
  code: {
    Default: `import { Code, InlineCode } from "@/components/ui/code";

<div className="flex w-full max-w-2xl flex-col gap-3">
  <p className="text-copy-14 text-muted-foreground">
    Install with <InlineCode>npm i geist</InlineCode> and import the component.
  </p>
  <Code syntax="javascript">{\`console.log("Hello")\`}</Code>
</div>`,
  },
  "copy-button": {
    Default: `import { CopyButton } from "@/components/ui/copy-button";

<div className="flex flex-wrap items-center gap-3">
  <CopyButton textToCopy="lipsum" />
  <span className="text-copy-13 text-muted-foreground">Click to copy “lipsum”</span>
</div>`,
  },
  "file-tree": {
    Default: `import {
  FileTree,
  FileTreeIcon,
  FileTreeItem,
  FileTreeLabel,
} from "@/components/ui/file-tree";

<div className="w-full max-w-xs">
  <FileTree>
    <FileTreeItem>
      <FileTreeIcon type="folder-open" />
      <FileTreeLabel>app</FileTreeLabel>
      <FileTreeItem>
        <FileTreeIcon type="file" />
        <FileTreeLabel>main.tsx</FileTreeLabel>
      </FileTreeItem>
    </FileTreeItem>
    <FileTreeItem>
      <FileTreeIcon type="folder" />
      <FileTreeLabel>public</FileTreeLabel>
    </FileTreeItem>
  </FileTree>
</div>`,
  },
  pagination: {
    Default: `import { Pagination } from "@/components/ui/pagination";

<Pagination
  previous={{ title: "Avatar", href: "#/components/avatar" }}
  next={{ title: "Phone", href: "#/components/phone" }}
/>`,
  },
  phone: {
    Composition: `import { Phone, PhoneScreen } from "@/components/ui/phone";

<div className="w-full max-w-xs">
  <Phone>
    <PhoneScreen>
      <div className="flex h-full items-center justify-center bg-gray-alpha-100 text-copy-14 text-muted-foreground">
        Mobile screenshot
      </div>
    </PhoneScreen>
  </Phone>
</div>`,
  },
  "error-card": {
    Default: `import { Button } from "@/components/ui/button";
import {
  ErrorCard,
  ErrorCardAction,
  ErrorCardDescription,
  ErrorCardTitle,
} from "@/components/ui/error-card";
import { Trash2 } from "lucide-react";

<ErrorCard className="w-full max-w-md" icon={<Trash2 className="size-6" />}>
  <ErrorCardTitle>No Credits Left</ErrorCardTitle>
  <ErrorCardDescription>Add credits to continue deploying projects.</ErrorCardDescription>
  <ErrorCardAction>
    <Button>Add Credits</Button>
  </ErrorCardAction>
</ErrorCard>`,
  },
  "middle-truncate": {
    Examples: `import { MiddleTruncate } from "@/components/ui/middle-truncate";

<div className="w-64 font-mono text-copy-13 text-foreground">
  <MiddleTruncate value="https://example.com/teams/hustradio/projects/geist-style-framework/deployments/latest" />
</div>`,
  },
  "relative-time-card": {
    Default: `import { RelativeTimeCard } from "@/components/ui/relative-time-card";

<RelativeTimeCard date={Date.now() - 5 * 60 * 1000} />`,
  },
};
