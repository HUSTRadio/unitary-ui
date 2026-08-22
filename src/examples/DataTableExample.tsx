import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
} from "@/components/ui/table";

/** 数据表格示例 — Table + Checkbox + Badge + Select + 搜索过滤。 */
interface Asset {
  id: string;
  name: string;
  category: string;
  status: "available" | "borrowed" | "maintenance";
}

const ASSETS: Asset[] = [
  { id: "NB-2024-0012", name: "ThinkPad X1 Carbon", category: "办公设备", status: "borrowed" },
  { id: "FA-OSC-0007", name: "SIGLENT SDS1104X-E", category: "仪器设备", status: "available" },
  { id: "FA-RF-0012", name: "RF Explorer 6G Combo", category: "仪器设备", status: "available" },
  { id: "RAD-0009", name: "Motorola DP4801e", category: "通信设备", status: "maintenance" },
  { id: "FA-DIS-0003", name: "Dell U2723QE", category: "办公设备", status: "borrowed" },
  { id: "FA-RF-0021", name: "天线分析仪 KC901S+", category: "仪器设备", status: "available" },
];

const STATUS_META: Record<Asset["status"], { label: string; variant: "green" | "blue" | "amber" }> =
  {
    available: { label: "可借", variant: "green" },
    borrowed: { label: "借出中", variant: "blue" },
    maintenance: { label: "维修中", variant: "amber" },
  };

export function DataTableExample() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<number[]>([]);

  const rows = useMemo(() => {
    return ASSETS.filter((asset, index) => {
      if (filter !== "all" && asset.status !== filter) return false;
      if (
        query &&
        !`${asset.name} ${asset.id} ${asset.category}`.toLowerCase().includes(query.toLowerCase())
      )
        return false;
      return index >= 0;
    });
  }, [query, filter]);

  const allChecked =
    rows.length > 0 && rows.every((_, i) => selected.includes(ASSETS.indexOf(rows[i])));

  function toggleAll() {
    if (allChecked) {
      setSelected([]);
    } else {
      setSelected(rows.map((row) => ASSETS.indexOf(row)));
    }
  }

  function toggleRow(index: number) {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-heading-24 text-foreground">资产列表</h2>
          <p className="text-copy-14 text-muted-foreground">
            {ASSETS.length} 项资产 · 已选择 {selected.length} 项
          </p>
        </div>
        <Button prefix={<Plus className="size-3.5" aria-hidden />}>登记资产</Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-64">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            className="pl-9"
            placeholder="搜索名称、编号、类别"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="搜索资产"
          />
        </div>
        <Select
          className="w-32"
          value={filter}
          onValueChange={setFilter}
          aria-label="按状态筛选"
        >
          <SelectItem value="all">全部</SelectItem>
          <SelectItem value="available">可借</SelectItem>
          <SelectItem value="borrowed">借出中</SelectItem>
          <SelectItem value="maintenance">维修中</SelectItem>
        </Select>
      </div>

      <TableRoot>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  size="sm"
                  aria-label="全选"
                  checked={allChecked}
                  indeterminate={!allChecked && selected.length > 0}
                  onChange={toggleAll}
                />
              </TableHead>
              <TableHead>资产</TableHead>
              <TableHead>编号</TableHead>
              <TableHead>类别</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((asset) => {
              const index = ASSETS.indexOf(asset);
              const meta = STATUS_META[asset.status];
              return (
                <TableRow
                  key={asset.id}
                  data-state={selected.includes(index) ? "selected" : undefined}
                >
                  <TableCell>
                    <Checkbox
                      size="sm"
                      aria-label={`选择 ${asset.name}`}
                      checked={selected.includes(index)}
                      onChange={() => toggleRow(index)}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{asset.name}</TableCell>
                  <TableCell className="font-mono text-copy-13 tabular-nums text-muted-foreground">
                    {asset.id}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{asset.category}</TableCell>
                  <TableCell>
                    <Badge variant={meta.variant}>{meta.label}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button type="tertiary" size="small">
                      查看
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableRoot>
    </div>
  );
}
