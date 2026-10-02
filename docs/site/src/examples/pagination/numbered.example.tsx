import { useState } from "react";
import { NumberedPagination } from "@/components/ui/pagination";
import { useI18n } from "@/lib/i18n";

export default function NumberedExample() {
  const [page, setPage] = useState(6);
  const { locale } = useI18n();
  return (
    <div className="w-full space-y-4">
      <p role="status" className="text-copy-14 text-muted-foreground">
        {locale === "zh-CN"
          ? `搜索结果：第 ${page} 页，共 24 页`
          : `Search results: page ${page} of 24`}
      </p>
      <NumberedPagination totalPages={24} page={page} onPageChange={setPage} />
    </div>
  );
}
