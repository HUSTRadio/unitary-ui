import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

/**
 * Book — 书本容器（带翻页效果，对应官方 Book，docs/geist-markdown-refs/components/book.md）。
 * 容器：flex flex-col + 12px 圆角 + 发丝线边框 + bg-background。
 * 多页通过 <BookPage title="..."> 子元素声明，内部用 Tabs 切换翻页。
 * 官方最佳实践：封面视为装饰性 chrome，标题走底层标题元素；内容区用语义 token 而不是裸 hex。
 */
interface BookPageProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const BookPage = React.forwardRef<HTMLDivElement, BookPageProps>(
  ({ className, children }, ref) => (
    <div ref={ref} className={cn("p-6", className)}>
      {children}
    </div>
  ),
);
BookPage.displayName = "BookPage";

interface BookProps {
  /** 书本标题（可选，渲染为封面标题） */
  title?: string;
  className?: string;
  /** BookPage 列表 */
  children: React.ReactNode;
}

function Book({ title, className, children }: BookProps) {
  const pages = React.Children.toArray(children) as React.ReactElement<BookPageProps>[];

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-[12px] border border-gray-alpha-400 bg-background",
        className,
      )}
    >
      {title ? (
        <div className="border-b border-gray-alpha-400 px-6 pt-5 pb-4">
          <h3 className="text-label-16 font-medium text-foreground">{title}</h3>
        </div>
      ) : null}
      <Tabs defaultValue={pages[0]?.props.title ?? "page-0"}>
        <TabsList className="px-2">
          {pages.map((page, i) => (
            <TabsTrigger key={i} value={page.props.title ?? `page-${i}`}>
              {page.props.title ?? `Page ${i + 1}`}
            </TabsTrigger>
          ))}
        </TabsList>
        {pages.map((page, i) => (
          <TabsContent key={i} value={page.props.title ?? `page-${i}`}>
            {page}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export { Book, BookPage };
