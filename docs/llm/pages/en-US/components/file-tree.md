# File Tree

> Route: `/components/file-tree`

Displays a hierarchical directory structure with expandable folders and files.

[Back to Components](#/components)

# File Tree

File Tree

Displays a hierarchical directory structure with expandable folders and files.

## When to use

- When you need to show a project's file or directory hierarchy in documentation, examples, or preview panels.
- When users need to expand and collapse folders to navigate a multi-level file system structure used for read-only display purposes.
- In technical docs to illustrate project structures, config file locations, or hierarchical relationships of generated results.

## When not to use

- Don't use for interactive file operations (rename, delete, upload) — a dedicated File Manager component is more appropriate.
- When dealing with hundreds of files, consider a paginated or lazily-loaded file browser instead of rendering the entire tree at once.
- Flat single-file display doesn't need File Tree — use CodeBlock or Snippet directly for individual file content.

## Examples

### Default file tree

Displays the default file tree component with expandable folder nodes and file icons in a standard hierarchical layout.

## Accessibility

- Each expandable folder node should use a button element with aria-expanded to indicate current expand/collapse state for screen readers.
- Folder triggers are native buttons: use Tab to focus them and Enter or Space to expand or collapse. The component does not implement tree-style arrow-key navigation.
- File names should serve as the sole readable label of focusable elements — avoid relying on color or icons for conveying meaningful information.

## Controlled behavior

- Expand/collapse state can be externally controlled via expandable props, supporting programmatic expansion of specific nodes.
- Selected node state (where selection is supported) can sync via controlled props for multi-select or cross-component linkage.
- Callers can listen to expand/collapse callback events to persist the tree's expanded state across sessions.

## Responsive behavior

- On narrow screens the file tree may enable horizontal scrolling to accommodate long file names while maintaining indentation levels.
- Folder expand/collapse buttons increase touch target size on small screens to ensure reliable finger-based interactions.
- The file tree container supports overflow-auto behavior — excessively long paths won't break the layout boundaries.

## Theme behavior

- File and folder icons change color with theme variables, maintaining visibility across dark and light modes.
- Selection highlights and hover background colors follow the application's theme color spec, including focus indicator contrast ratios.

## Live Demo

- - main.tsx

  - dashboard.tsx

- public

```tsx
import { FileTree, FileTreeIcon, FileTreeItem, FileTreeLabel } from "@/components/ui/file-tree";

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
</div>;
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { FileTree, FileTreeItem, FileTreeLabel, FileTreeIcon } from "@/components/ui/file-tree";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">open</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled expansion state for FileTreeItem.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultOpen</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Initial expansion state for FileTreeItem.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onOpenChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(open: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Receives FileTreeItem expansion changes.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">href</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Renders a leaf FileTreeItem as a link.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">type</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"file" | "folder" | "folder-open"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">FileTreeIcon glyph type.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"file"</td></tr></tbody></table>
