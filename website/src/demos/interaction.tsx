import { useState } from "react";
import { Badge, Button, Checkbox, Input, Switch, SwitchControl, Tabs } from "@hustradio/unitary-ui";
import { useWebsiteLanguage } from "../language";

export default function InteractionDemo() {
  const zh = useWebsiteLanguage().language === "zh-CN";
  const [tab, setTab] = useState("controls");
  const [checked, setChecked] = useState(true);
  const [environment, setEnvironment] = useState("preview");
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  return <div className="website-studio" data-slot="interaction-demo">
    <div className="website-studio-header"><span>{zh ? "组件工作台" : "Component studio"}</span><Badge variant="outline" size="compact">Unitary UI</Badge></div>
    <Tabs tabs={[{ value: "controls", title: zh ? "控件" : "Controls" }, { value: "form", title: zh ? "表单" : "Form" }]} selected={tab} setSelected={setTab} ariaLabel={zh ? "演示类型" : "Demo type"} />
    {tab === "controls" ? <div className="website-studio-body" role="tabpanel">
      <div className="website-control-row"><p className="website-demo-label">{zh ? "操作与反馈" : "Action and feedback"}</p>
        <div className="website-button-row"><Button typeName="button" onClick={() => setCount(value => value + 1)}>{zh ? "试一下" : "Try it"}</Button><Button typeName="button" type="secondary" onClick={() => setCount(0)}>{zh ? "重置" : "Reset"}</Button></div>
        <p role="status" className="website-inline-status">{zh ? `已点击 ${count} 次` : `${count} clicks`}</p>
      </div>
      <div className="website-control-row"><p className="website-demo-label">{zh ? "选择状态" : "Selection"}</p><Checkbox checked={checked} onChange={() => setChecked(value => !value)}>{zh ? "保留每个细节" : "Keep every detail"}</Checkbox></div>
      <div className="website-control-row"><p className="website-demo-label">{zh ? "环境" : "Environment"}</p>
        <Switch name="website-environment" value={environment} onValueChange={setEnvironment}>
          <SwitchControl value="preview" label={zh ? "预览" : "Preview"} />
          <SwitchControl value="production" label={zh ? "正式" : "Production"} />
        </Switch>
      </div>
    </div> : <form className="website-studio-body" role="tabpanel" noValidate onSubmit={event => {
      event.preventDefault(); setSubmitted(true); setSaved(Boolean(name.trim()));
    }}>
      <Input label={zh ? "项目名称" : "Project name"} placeholder="Create the One." value={name} onChange={event => { setName(event.target.value); setSaved(false); }} error={submitted && !name.trim() ? (zh ? "请输入项目名称。" : "Enter a project name.") : undefined} />
      <p className="text-copy-13 text-muted-foreground">{zh ? "在浏览器中体验输入与校验。" : "Try input and validation in your browser."}</p>
      <Button typeName="submit">{zh ? "保存预览" : "Save preview"}</Button>
      <p role="status" className="website-inline-status">{saved ? (zh ? `已保存预览：${name.trim()}` : `Preview saved: ${name.trim()}`) : ""}</p>
    </form>}
    <div className="website-studio-footer"><span>{zh ? "同一套组件，从输入到反馈。" : "One set of components, from input to feedback."}</span><span aria-hidden>↗</span></div>
  </div>;
}
