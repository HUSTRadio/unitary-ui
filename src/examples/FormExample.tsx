import { useState } from "react";
import { User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";

/**
 * 表单示例 — 展示 Input / Select / Textarea / Checkbox / Toggle / Button 的组合用法。
 * 覆盖：带图标输入、必填校验提示、disabled 态、提交加载态。
 */
export function FormExample() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [notes, setNotes] = useState("");
  const [notify, setNotify] = useState(true);
  const [terms, setTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const nameError = submitted && name.trim() === "";
  const emailError = submitted && !/^\S+@\S+\.\S+$/.test(email);

  function handleSubmit() {
    setSubmitting(true);
    setSubmitted(true);
    setTimeout(() => setSubmitting(false), 1200);
  }

  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      <div className="space-y-1">
        <h2 className="text-heading-24 text-foreground">成员信息</h2>
        <p className="text-copy-14 text-muted-foreground">带校验、加载态与禁用态的表单组合示例</p>
      </div>

      <div className="material-base space-y-4 p-5">
        <div className="space-y-1.5">
          <label htmlFor="f-name" className="text-label-14 text-foreground">
            姓名 <span className="text-danger">*</span>
          </label>
          <Input
            id="f-name"
            placeholder="输入姓名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={nameError || undefined}
          />
          {nameError && <p className="text-copy-13 text-danger">姓名为必填项</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="f-email" className="text-label-14 text-foreground">
              邮箱 <span className="text-danger">*</span>
            </label>
            <Input
              id="f-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={emailError || undefined}
            />
            {emailError && <p className="text-copy-13 text-danger">邮箱格式不正确</p>}
          </div>
          <div className="space-y-1.5">
            <label htmlFor="f-phone" className="text-label-14 text-foreground">
              电话
            </label>
            <Input
              id="f-phone"
              placeholder="+86 138-0000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="f-dept" className="text-label-14 text-foreground">
            部门
          </label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger id="f-dept" aria-label="选择部门">
              <SelectValue placeholder="选择部门" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">行政组</SelectItem>
              <SelectItem value="tech">技术组</SelectItem>
              <SelectItem value="activity">活动组</SelectItem>
              <SelectItem value="media">宣传组</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="f-notes" className="text-label-14 text-foreground">
            备注
          </label>
          <Textarea
            id="f-notes"
            placeholder="补充说明（可选）"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
          <div>
            <p className="text-label-14 text-foreground">邮件通知</p>
            <p className="text-copy-13 text-muted-foreground">有变动时发送邮件提醒</p>
          </div>
          <Toggle checked={notify} onCheckedChange={(v) => setNotify(v)} aria-label="邮件通知" />
        </div>

        <label className="flex items-center gap-2 text-label-14 text-foreground">
          <Checkbox checked={terms} onCheckedChange={(c) => setTerms(c === true)} />
          我已阅读并同意相关条款
        </label>

        <div className="flex items-center gap-3 pt-1">
          <Button onClick={handleSubmit} loading={submitting} disabled={!terms}>
            提交
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setName("");
              setEmail("");
              setPhone("");
              setDepartment("");
              setNotes("");
              setSubmitted(false);
            }}
          >
            重置
          </Button>
        </div>
      </div>

      {/* 图标 + 禁用态补充 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input defaultValue="Leon" aria-label="只读示例" disabled />
        <div className="flex items-center gap-2 text-label-14 text-muted-foreground">
          <User className="size-4" aria-hidden /> 图标示意（lucide）
        </div>
      </div>
    </div>
  );
}
