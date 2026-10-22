import { useRef, useState } from "react";
import {
  Badge,
  Button,
  ButtonLink,
  Collapse,
  CollapseContent,
  CollapseTrigger,
  Footer,
  Input,
  Modal,
  ModalContent,
  ModalDescription,
  ModalTitle,
  Navbar,
  SiteNavigation,
  Tabs,
  ThemeSwitcher,
} from "@hustradio/unitary-ui";
import { ArrowRight, Check, Layers, Zap } from "lucide-react";
import { copy, features, metrics, plans, questions, site, steps } from "./content";
import { LanguageSwitcher, useLocale } from "./locale";

export default function App() {
  const { locale } = useLocale();
  const text = copy[locale];
  const [billing, setBilling] = useState("monthly");
  const [plan, setPlan] = useState("Team");
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const returnFocus = useRef<HTMLButtonElement | null>(null);
  const request = (button: HTMLButtonElement, name = "Team") => {
    returnFocus.current = button;
    setPlan(name);
    setSubmitted(false);
    setOpen(true);
  };
  const navigation = ["features", "workflow", "pricing", "faq"].map((id) => ({
    id,
    label: text[id as "features"],
    href: `#${id}`,
  }));
  return (
    <>
      <a
        className="template-skip focus-ring rounded-md bg-background px-4 py-2"
        href="#main-content"
      >
        {text.skip}
      </a>
      <Navbar>
        <div className="template-container flex h-full items-center gap-2">
          <a href="#top" className="mr-auto flex items-center gap-2 text-heading-20 focus-ring">
            <Layers className="size-5" aria-hidden />
            {site.brand}
          </a>
          <SiteNavigation items={navigation} label={text.navigation} desktopBreakpoint={1024} />
          <LanguageSwitcher />
          <ThemeSwitcher compact />
        </div>
      </Navbar>
      <main id="main-content" tabIndex={-1} className="outline-none">
        <section
          id="top"
          className="template-container template-section grid gap-10 py-16 lg:grid-cols-2 lg:items-center lg:py-24"
        >
          <div>
            <Badge>{text.eyebrow}</Badge>
            <h1 className="mt-6 text-heading-40 text-balance">{text.title}</h1>
            <p className="mt-6 text-copy-18 text-muted-foreground">{text.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                typeName="button"
                size="large"
                suffix={<ArrowRight aria-hidden />}
                onClick={(event) => request(event.currentTarget)}
              >
                {text.start}
              </Button>
              <ButtonLink href="#features" type="secondary" size="large">
                {text.explore}
              </ButtonLink>
            </div>
            <p className="mt-4 text-copy-13 text-muted-foreground">{text.sample}</p>
          </div>
          <div className="template-panel">
            <div className="flex items-center gap-3">
              <Zap className="size-5" aria-hidden />
              <h2 className="text-heading-20">{text.preview}</h2>
            </div>
            <p className="mt-3 text-copy-14 text-muted-foreground">{text.previewLead}</p>
            <dl className="mt-8 grid gap-6 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.key}>
                  <dt className="text-copy-13 text-muted-foreground">{text[metric.key]}</dt>
                  <dd className="mt-2 text-heading-32">{metric.value}</dd>
                </div>
              ))}
            </dl>
            <ul className="mt-8 space-y-4 border-t border-border pt-6">
              {steps.map((step, index) => (
                <li key={index} className="flex items-center gap-3 text-copy-14">
                  <Check className="size-4 text-muted-foreground" aria-hidden />
                  {step[locale]}
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section id="features" className="template-container template-section py-12">
          <h2 className="text-heading-32">{text.featuresTitle}</h2>
          <p className="mt-3 text-copy-16 text-muted-foreground">{text.featuresLead}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {features.map((feature, index) => (
              <article key={index} className="template-panel">
                <h3 className="text-heading-20">{feature.title[locale]}</h3>
                <p className="mt-3 text-copy-14 text-muted-foreground">
                  {feature.description[locale]}
                </p>
              </article>
            ))}
          </div>
        </section>
        <section id="workflow" className="template-container template-section py-12">
          <h2 className="text-heading-32">{text.workflowTitle}</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <li key={index} className="flex items-start gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-alpha-200 text-label-14">
                  {index + 1}
                </span>
                <p className="text-copy-16">{step[locale]}</p>
              </li>
            ))}
          </ol>
        </section>
        <section id="pricing" className="template-container template-section py-12">
          <h2 className="text-heading-32">{text.pricingTitle}</h2>
          <p className="mt-3 text-copy-16 text-muted-foreground">{text.pricingLead}</p>
          <div className="mt-6">
            <Tabs
              variant="secondary"
              ariaLabel={text.pricing}
              selected={billing}
              setSelected={setBilling}
              tabs={[
                { title: text.monthly, value: "monthly" },
                { title: text.yearly, value: "yearly" },
              ]}
            />
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {plans.map((item) => (
              <article key={item.id} className="template-panel flex flex-col">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-heading-20">{item.name}</h3>
                  {item.recommended && <Badge>{text.recommended}</Badge>}
                </div>
                <p className="mt-6">
                  <strong className="text-heading-32">
                    {new Intl.NumberFormat(locale, {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(billing === "yearly" ? item.yearly : item.monthly)}
                  </strong>
                  <span className="ml-2 text-copy-13 text-muted-foreground">{text.perMonth}</span>
                </p>
                <p className="mt-2 text-copy-13 text-muted-foreground">
                  {billing === "yearly" ? text.annualNote : text.monthlyNote}
                </p>
                <ul className="my-6 flex-1 space-y-3">
                  {item.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-copy-14">
                      <Check className="size-4" aria-hidden />
                      {feature[locale]}
                    </li>
                  ))}
                </ul>
                <Button
                  typeName="button"
                  type={item.recommended ? "default" : "secondary"}
                  aria-label={`${text.choose} ${item.name}`}
                  onClick={(event) => request(event.currentTarget, item.name)}
                >
                  {text.choose}
                </Button>
              </article>
            ))}
          </div>
        </section>
        <section id="faq" className="template-container template-section py-12">
          <h2 className="text-heading-32">{text.faqTitle}</h2>
          <div className="mt-6">
            {questions.map((item, index) => (
              <Collapse key={index} className="border-b border-border">
                <h3>
                  <CollapseTrigger>{item.question[locale]}</CollapseTrigger>
                </h3>
                <CollapseContent>
                  <p className="pb-5 text-copy-16 text-muted-foreground">{item.answer[locale]}</p>
                </CollapseContent>
              </Collapse>
            ))}
          </div>
        </section>
        <section className="template-container py-16">
          <div className="template-panel text-center">
            <h2 className="text-heading-32">{text.closing}</h2>
            <p className="mt-4 text-copy-16 text-muted-foreground">{text.closingLead}</p>
            <Button
              className="mt-6"
              typeName="button"
              onClick={(event) => request(event.currentTarget)}
            >
              {text.start}
            </Button>
          </div>
        </section>
      </main>
      <div className="template-container">
        <Footer
          columns={[
            {
              title: site.brand,
              links: navigation.map((item) => ({ label: item.label, href: item.href! })),
            },
          ]}
          slotLeading={<strong className="text-heading-20">{site.brand}</strong>}
          slotBottom={<p className="text-copy-13 text-muted-foreground">{text.rights}</p>}
        />
      </div>
      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            returnFocus.current?.focus();
          }}
        >
          <ModalTitle>{text.formTitle}</ModalTitle>
          <ModalDescription className="mt-2">{text.formLead}</ModalDescription>
          {submitted ? (
            <div className="mt-6 space-y-6">
              <p role="status" className="text-copy-16">
                {text.done}
              </p>
              <Button typeName="button" onClick={() => setOpen(false)}>
                {text.close}
              </Button>
            </div>
          ) : (
            <form
              className="mt-6 space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
            >
              <p className="text-copy-14">
                {text.selectedPlan}: <strong>{plan}</strong>
              </p>
              <Input name="name" label={text.name} autoComplete="name" required />
              <Input name="email" type="email" label={text.email} autoComplete="email" required />
              <div className="flex flex-wrap gap-3">
                <Button typeName="submit">{text.submit}</Button>
                <Button typeName="button" type="secondary" onClick={() => setOpen(false)}>
                  {text.cancel}
                </Button>
              </div>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
