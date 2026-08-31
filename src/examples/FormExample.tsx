import { useState } from "react";
import { User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
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
        <Input
          id="f-name"
          label="姓名（必填）"
          placeholder="输入姓名"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={nameError ? "姓名为必填项。" : undefined}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="f-email"
            type="email"
            label="邮箱（必填）"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError ? "邮箱格式不正确。" : undefined}
          />
          <Input
            id="f-phone"
            label="电话"
            placeholder="+86 138-0000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <Select
          label="部门"
          value={department}
          onValueChange={setDepartment}
          placeholder="选择部门"
          aria-label="选择部门"
        >
          <SelectItem value="admin">行政组</SelectItem>
          <SelectItem value="tech">技术组</SelectItem>
          <SelectItem value="activity">活动组</SelectItem>
          <SelectItem value="media">宣传组</SelectItem>
        </Select>

        <Textarea
          id="f-notes"
          label="备注"
          placeholder="补充说明（可选）"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
          <div>
            <p className="text-label-14 text-foreground">邮件通知</p>
            <p className="text-copy-13 text-muted-foreground">有变动时发送邮件提醒</p>
          </div>
          <Toggle checked={notify} onChange={() => setNotify(!notify)} aria-label="邮件通知" />
        </div>

        <Checkbox checked={terms} onChange={() => setTerms(!terms)}>
          我已阅读并同意相关条款。
        </Checkbox>

        <div className="flex items-center gap-3 pt-1">
          <Button typeName="button" onClick={handleSubmit} loading={submitting} disabled={!terms}>
            提交成员信息
          </Button>
          <Button
            typeName="button"
            type="tertiary"
            onClick={() => {
              setName("");
              setEmail("");
              setPhone("");
              setDepartment("");
              setNotes("");
              setNotify(true);
              setTerms(false);
              setSubmitting(false);
              setSubmitted(false);
            }}
          >
            重置表单
          </Button>
        </div>
      </div>

      {/* 禁用态补充 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="禁用输入" defaultValue="Leon" disabled />
        <div className="flex items-center gap-2 text-label-14 text-muted-foreground">
          <User className="size-4" aria-hidden /> 图标示意（lucide）
        </div>
      </div>
    </div>
  );
}
