import { useState } from "react";
import { Bell, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";

/** 设置面板示例 — material 分区 + Toggle 列表 + 保存动效。 */
interface SettingRow {
  key: string;
  title: string;
  description: string;
  value: boolean;
}

export function SettingsExample() {
  const [rows, setRows] = useState<SettingRow[]>([
    { key: "email", title: "邮件通知", description: "审批结果通过邮件发送", value: true },
    { key: "push", title: "桌面推送", description: "实时提醒新待办", value: false },
    { key: "weekly", title: "每周摘要", description: "每周一发送资产周报", value: true },
  ]);
  const [language, setLanguage] = useState("zh");
  const [saved, setSaved] = useState(false);

  function toggleRow(key: string) {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, value: !r.value } : r)));
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="space-y-1">
        <h2 className="text-heading-24 text-foreground">偏好设置</h2>
        <p className="text-copy-14 text-muted-foreground">
          分区卡片（material-*）+ 开关列表 + 保存反馈
        </p>
      </div>

      {/* 通知设置 */}
      <section className="material-base p-5">
        <div className="mb-3 flex items-center gap-2">
          <Bell className="size-4 text-muted-foreground" aria-hidden />
          <h3 className="text-label-16 font-medium text-foreground">通知</h3>
        </div>
        <div className="divide-y divide-border">
          {rows.map((row) => (
            <div key={row.key} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="text-label-14 text-foreground">{row.title}</p>
                <p className="text-copy-13 text-muted-foreground">{row.description}</p>
              </div>
              <Toggle
                checked={row.value}
                onChange={() => toggleRow(row.key)}
                aria-label={row.title}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 界面偏好 */}
      <section className="material-base p-5">
        <h3 className="mb-3 text-label-16 font-medium text-foreground">界面</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="s-lang" className="text-label-14 text-foreground">
              界面语言
            </label>
            <Select
              id="s-lang"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              aria-label="界面语言"
            >
              <option value="zh">简体中文</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="s-org" className="text-label-14 text-foreground">
              组织名称
            </label>
            <Input id="s-org" defaultValue="HUST 无线电社团" />
          </div>
        </div>
      </section>

      {/* 操作 */}
      <div className="flex items-center gap-3">
        <Button onClick={handleSave} prefix={<Save className="size-3.5" aria-hidden />}>
          {saved ? "已保存" : "保存更改"}
        </Button>
        <Button type="tertiary">恢复默认</Button>
      </div>
    </div>
  );
}
