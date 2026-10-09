import { withLayerBridge } from "@/lib/layer-bridge";
import * as React from "react";
import { Popover } from "radix-ui";

import { Button, buttonVariants } from "@/components/ui/button";
import { RatingButtons, type RatingValue } from "@/components/ui/rating-pill";
import { Select, SelectItem } from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LayerPopoverContent = withLayerBridge(Popover.Content);

/**
 * Feedback — 与实时 vercel.com/geist/feedback 对齐的默认 Popover 与 Inline 胶囊。
 * 默认形态由 32px 次级按钮打开 340px 锚定表单；Inline 形态从 274×48 胶囊
 * 在同一容器内展开至 336px。评分 hover/selected 统一使用官方蓝色语义。
 *
 * 主题（topic）契约：只有默认 Popover 变体渲染主题 Select（Inline 变体不渲染）。
 * topic 作为 `onSubmit` 第 4 个参数传出；`includeTopicInMetadata` 为 true 时
 * 才额外合并进第 3 个参数 metadata（键名 topic），避免默认行为悄悄污染 metadata。
 */
type FeedbackRatingValue = RatingValue;
type FeedbackType = "inline";
type FeedbackMetadata = Record<string, string>;
type FeedbackTopicChangeHandler = (topic: string) => void;
type FeedbackTopic = string | undefined;
type FeedbackSubmitHandler = (
  rating: FeedbackRatingValue | undefined,
  text: string,
  metadata?: FeedbackMetadata,
  topic?: string,
) => void;

const TOPICS = [
  "AI",
  "Accounts and Access Controls",
  "Billing",
  "CDN (Firewall, Caching)",
  "CI/CD (Builds, Deployments, Environment Variables)",
  "Dashboard Interface (Navigation, UI Issues)",
  "Domains",
  "Frameworks",
  "Marketplace and Integrations",
] as const;

/** 稳定空数组，避免每次渲染都生成新引用触发 select 分支抖动。 */
const EMPTY_TOPICS: readonly string[] = [];

/**
 * Inline 浮动卡片展开后的固定宽度（px）。收起态宽度由内容决定（header 自然宽度），
 * 展开时以胶囊几何中心为原点对称扩展到该宽度。
 */
const INLINE_FLOATING_WIDTH = 336;

/** 供调用方以编程方式复用官方主题清单（例如自定义 topics 时作基集）。 */
const FEEDBACK_TOPICS: readonly string[] = TOPICS;

interface FeedbackProps extends Omit<
  React.ComponentProps<"div">,
  "onSubmit" | "defaultValue" | "prefix" | "suffix"
> {
  label?: string;
  copy?: string;
  dryRun?: boolean;
  type?: FeedbackType;
  showTopics?: boolean;
  metadata?: FeedbackMetadata;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  defaultValue?: FeedbackRatingValue;
  /** 常显主题选择器；传入后 Select 始终渲染（不再需要 showTopics 开关）。 */
  topics?: readonly string[];
  /** 受控主题；与 onTopicChange 配对使用。 */
  topic?: FeedbackTopic;
  /** 非受控初始主题。 */
  defaultTopic?: string;
  /** 主题变化回调。 */
  onTopicChange?: FeedbackTopicChangeHandler;
  /** 收到第三参 metadata 时，是否额外把 topic 合并进去。 */
  includeTopicInMetadata?: boolean;
  onSubmit?: FeedbackSubmitHandler;
}

interface FeedbackFormProps {
  copy?: string;
  dryRun: boolean;
  includeTopicInMetadata: boolean;
  includeRatings: boolean;
  metadata?: FeedbackMetadata;
  onSuccessfulSubmit: () => void;
  onSubmit?: FeedbackSubmitHandler;
  rating?: FeedbackRatingValue;
  setRating: (rating: FeedbackRatingValue) => void;
  topics: readonly string[];
  text: string;
  setText: (text: string) => void;
  topic: FeedbackTopic;
  setTopic: FeedbackTopicChangeHandler;
}

function MarkdownSupported({ id }: { id: string }) {
  const { t } = useI18n();
  return (
    <div
      id={id}
      data-slot="feedback-support"
      className="flex h-4 items-center justify-end gap-1 text-[12px] leading-4 text-gray-900"
    >
      <svg aria-hidden fill="none" height="14" viewBox="0 0 22 14" width="22">
        <path
          clipRule="evenodd"
          d="M19.5 1.25H2.5C1.80964 1.25 1.25 1.80964 1.25 2.5V11.5C1.25 12.1904 1.80964 12.75 2.5 12.75H19.5C20.1904 12.75 20.75 12.1904 20.75 11.5V2.5C20.75 1.80964 20.1904 1.25 19.5 1.25ZM2.5 0C1.11929 0 0 1.11929 0 2.5V11.5C0 12.8807 1.11929 14 2.5 14H19.5C20.8807 14 22 12.8807 22 11.5V2.5C22 1.11929 20.8807 0 19.5 0H2.5ZM3 3.5H4H4.25H4.6899L4.98715 3.82428L7 6.02011L9.01285 3.82428L9.3101 3.5H9.75H10H11V4.5V10.5H9V6.79807L7.73715 8.17572L7 8.97989L6.26285 8.17572L5 6.79807V10.5H3V4.5V3.5ZM15 7V3.5H17V7H19.5L17 9.5L16 10.5L15 9.5L12.5 7H15Z"
          fill="var(--uni-gray-700)"
          fillRule="evenodd"
        />
      </svg>
      {t("Markdown supported.")}
    </div>
  );
}

function FeedbackForm({
  copy,
  dryRun,
  includeTopicInMetadata,
  includeRatings,
  metadata,
  onSuccessfulSubmit,
  onSubmit,
  rating,
  setRating,
  text,
  setText,
  topic,
  setTopic,
  topics,
}: FeedbackFormProps) {
  const { t } = useI18n();
  const supportId = React.useId();
  // topicOptions 已由 Feedback 按变体裁剪（Inline 恒为空数组），这里不再单看 showTopics。
  const showTopicSelect = topics.length > 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (dryRun) return;
    if (includeTopicInMetadata) {
      onSubmit?.(rating, text, topic ? { ...metadata, topic } : metadata, topic);
      onSuccessfulSubmit();
      return;
    }
    onSubmit?.(rating, text, metadata, topic);
    onSuccessfulSubmit();
  };

  return (
    <form className="h-full" onSubmit={handleSubmit}>
      <div data-slot="feedback-form-body" className="flex flex-col gap-2 p-2">
        {copy ? <p className="px-1 text-copy-14 text-gray-900">{copy}</p> : null}
        {showTopicSelect ? (
          <Select
            data-slot="feedback-topic-select"
            aria-label={t("Product topic selection")}
            placeholder={t("Select a topic...")}
            size="small"
            value={topic ?? ""}
            onValueChange={setTopic}
          >
            {(topics.length > 0 ? topics : TOPICS).map((topicName) => (
              <SelectItem key={topicName} value={topicName}>
                {t(topicName)}
              </SelectItem>
            ))}
          </Select>
        ) : null}
        <label className="block">
          <span className="sr-only">{t("Feedback")}</span>
          <span className="block w-full overflow-hidden rounded-md shadow-[0_0_0_1px_var(--uni-gray-alpha-400)] transition-[box-shadow] duration-(--uni-duration-fast) hover:shadow-[0_0_0_1px_var(--uni-gray-alpha-500)] focus-within:shadow-[0_0_0_1px_var(--uni-gray-alpha-600),0_0_0_4px_rgba(0,0,0,0.16)]">
            <textarea
              data-slot="feedback-textarea"
              aria-describedby={supportId}
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={t("Your feedback...")}
              className="block h-[100px] w-full resize-none appearance-none border-none bg-background-100 px-3 py-2.5 text-copy-14 text-foreground outline-none placeholder:text-muted-foreground"
            />
          </span>
        </label>
        <MarkdownSupported id={supportId} />
      </div>
      <div
        data-slot="feedback-form-footer"
        className="flex items-center justify-between border-t border-gray-200 p-3"
      >
        {includeRatings ? <RatingButtons value={rating} onValueChange={setRating} /> : <span />}
        <Button typeName="submit" size="small" className="min-w-0">
          {t("Send")}
        </Button>
      </div>
    </form>
  );
}

function Feedback({
  label,
  copy,
  dryRun = false,
  type,
  showTopics = false,
  topics,
  topic: controlledTopic,
  defaultTopic,
  onTopicChange,
  includeTopicInMetadata = false,
  metadata,
  prefix,
  suffix,
  defaultValue,
  onSubmit,
  className,
  ...props
}: FeedbackProps) {
  const { t } = useI18n();
  const isInline = type === "inline";
  const [open, setOpen] = React.useState(false);
  const [rating, setRating] = React.useState<FeedbackRatingValue | undefined>(defaultValue);
  const [text, setText] = React.useState("");
  const [uncontrolledTopic, setUncontrolledTopic] = React.useState<FeedbackTopic>(defaultTopic);
  const topicIsControlled = Object.prototype.hasOwnProperty.call(props, "topic") ||
    controlledTopic !== undefined;
  const topic = topicIsControlled ? controlledTopic : uncontrolledTopic;
  // Inline 胶囊按设计不渲染主题 Select（见文件头契约），这里对 Inline 强制清空，
  // 避免调用方误以为 Inline 也能收集主题。
  const topicOptions: readonly string[] = isInline
    ? EMPTY_TOPICS
    : (topics ?? (showTopics ? TOPICS : EMPTY_TOPICS));
  const inlineRef = React.useRef<HTMLDivElement>(null);

  const setTopic = React.useCallback<FeedbackTopicChangeHandler>(
    (nextTopic) => {
      if (!topicIsControlled) setUncontrolledTopic(nextTopic);
      onTopicChange?.(nextTopic);
    },
    [onTopicChange, topicIsControlled],
  );

  /**
   * 收起态胶囊宽度：以 header 的自然内容宽度为准（header 恒为 w-fit，
   * 不随卡片拉伸，因此展开/收起任意时刻都能测到真实值）。
   * 展开卡片以「胶囊几何中心」为水平原点左右对称展开，需要这个值计算偏移。
   */
  const headerRef = React.useRef<HTMLDivElement>(null);
  const [collapsedWidth, setCollapsedWidth] = React.useState(0);

  React.useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const measure = () => setCollapsedWidth(header.offsetWidth);
    measure();
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(measure);
      observer.observe(header);
      return () => observer.disconnect();
    }
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const reset = React.useCallback(() => {
    setOpen(false);
    setRating(undefined);
    setText("");
    if (!topicIsControlled) setUncontrolledTopic(defaultTopic);
  }, [defaultTopic, topicIsControlled]);

  const closeInline = React.useCallback(() => {
    setOpen(false);
    setRating(undefined);
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement && inlineRef.current?.contains(activeElement)) {
      activeElement.blur();
    }
  }, []);

  React.useEffect(() => {
    if (!isInline || !open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!inlineRef.current?.contains(event.target as Node)) closeInline();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeInline();
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeInline, isInline, open]);

  const formProps: FeedbackFormProps = {
    copy: isInline ? undefined : copy,
    dryRun,
    includeRatings: !isInline,
    includeTopicInMetadata,
    metadata,
    onSuccessfulSubmit: reset,
    onSubmit,
    rating,
    setRating,
    text,
    setText,
    topic,
    setTopic,
    topics: topicOptions,
  };

  if (isInline) {
    const inlineLabel = copy ?? t("Was this helpful?");
    return (
      /*
       * 浮动弹窗形态（对齐官方页脚行为）：
       * - 外层 `relative h-12` 只做占位，恒定 48px，决定它在文档流中的位置；
       * - 内层 `absolute bottom-0` 贴住占位底部，展开时整体向上生长，
       *   因此既不推挤下方内容，也不改变父容器的垂直度量；
       * - 内层是单一连续容器（header 在最上、表单区在下），展开即“胶囊变高成卡片”，
       *   与官方页脚浮层一致：header 行升到顶部，内容向下依次排布。
       * 注意：祖先若带 overflow:hidden/auto 且上方空间不足会裁切浮层，
       * 调用方需保证容器不裁切（文档站 demo 已用 overflow-visible 例外）。
       */
      /*
       * 占位层必须有真实宽度：浮动卡片是绝对定位的，不贡献布局尺寸，
       * 若不显式给出收起态宽度，占位层会塌成 0 宽 → 父级（页脚 grid 的中间列）
       * 也塌成 0 宽，卡片只能从该点向右生长，视觉上表现为整体偏右。
       */
      <div
        {...props}
        // shrink-0：占位层是 flex item，默认可被容器压缩到 collapsedWidth 以下；而内层
        // 胶囊是绝对定位、不参与 shrink，仍保持 collapsedWidth → 两者脱钩后胶囊右缘
        // 突破视口，造成根级横向溢出（/components/feedback @320 实测 scrollWidth 330 > 320）。
        // 禁止压缩后，居中的 flex 容器（justify-center，官方 demo 形态）让占位层向两侧
        // 对称溢出：左侧溢出在 LTR 下不产生滚动宽度，胶囊完整可见且根节点零溢出。
        className={cn("relative h-12 shrink-0", className)}
        data-feedback-inline=""
        style={{ ...props.style, width: collapsedWidth || undefined }}
      >
        <div
          ref={inlineRef}
          data-slot="rating-pill"
          data-material={open ? "floating" : undefined}
          data-state={open ? "open" : "closed"}
          onBlurCapture={(event) => {
            // 仅当焦点确实落在容器外的元素上才收起；relatedTarget 为 null（窗口失焦、
            // 焦点转移到非元素、或浏览器未实现该字段）时不能当作“离开”，否则会误清评分。
            if (!open) return;
            const nextFocus = event.relatedTarget;
            if (!(nextFocus instanceof Node)) {
              const root = event.currentTarget;
              window.setTimeout(() => {
                if (root.isConnected && !root.contains(document.activeElement)) closeInline();
              }, 0);
              return;
            }
            if (!event.currentTarget.contains(nextFocus)) closeInline();
          }}
          style={{
            // 宽度用显式值而非 w-fit：fit-content 与固定值之间无法插值，
            // 显式值才能让宽度参与过渡（收起时宽高同时非线性还原）。
            width: open ? INLINE_FLOATING_WIDTH : collapsedWidth,
            // 水平原点 = 收起胶囊的几何中心：left 偏移半个宽度差，
            // 使展开时左右两缘对称向外扩展，而不是从左下角向右上角长。
            left: open ? (collapsedWidth - INLINE_FLOATING_WIDTH) / 2 : 0,
          }}
          className={cn(
            // 浮动层：bottom-0 贴占位底部，向上生长；flex-col 让 header 居顶、表单区在下。
            "absolute bottom-0 flex flex-col overflow-hidden bg-background-100 shadow-[var(--material-shadow-menu)]",
            // 窄屏收口：320px 视口下必须能退到 288px，否则会横向溢出。
            "max-w-[calc(100vw-32px)]",
            // 圆角必须用有限值：--radius-capsule / rounded-full 是“实际无穷大”，
            // 过渡到 rounded-xl 时会被浏览器钳制到 min(w,h)/2，末段出现半径突跳。
            "rounded-capsule-interpolable",
            // 宽度、水平位置与圆角共用同一条先快后缓曲线；高度由表单区的
            // grid-rows 过渡驱动，两者时长/曲线一致 → 宽高同时非线性还原。
            "transition-[width,left,border-radius] duration-(--uni-duration-fast) ease-snap motion-reduce:transition-none",
            open ? "rounded-xl" : "rounded-capsule-interpolable",
          )}
        >
          {/* header 恒为 w-fit + mx-auto：收起态即胶囊自然宽度；展开态在 336px 卡片内
              居中（与官方页脚浮层一致），且任意时刻都能测到自然宽度。 */}
          <div
            ref={headerRef}
            data-slot="feedback-inline-header"
            // 水平节奏统一为 17px（= 按钮内 8px 衬距 + 9px 间距，即表情之间的墨迹间距）：
            // 左内边距、文字→图标、图标之间、右内边距四处一致（此前 16/16/17/16）。
            className="mx-auto flex h-12 w-fit shrink-0 items-center gap-[9px] py-2 pr-[9px] pl-[17px]"
          >
            {prefix ? (
              <span className="inline-flex shrink-0 items-center justify-center [&>svg]:size-4">
                {prefix}
              </span>
            ) : null}
            {/* label 永不截断（无 truncate / whitespace-nowrap）。
                光学校准只作用于文字、不动图标：问题是「中文字形墨迹中心比 16px 对称
                图标的视中线低」（15px 实测 ink ascent 13 / descent 2 ≈ 0.5px），
                图标本身几何居中即光学居中，抬图标会把整组内容推离行中心。
                补偿量走共享 token --uni-ink-shift-cjk（中文字形档，15px ≈ 0.5px）。 */}
            <p className="ink-shift-cjk min-w-0 text-copy-14 whitespace-nowrap text-gray-900">
              {inlineLabel}
            </p>
            {suffix ? (
              <span className="inline-flex shrink-0 items-center justify-center [&>svg]:size-4">
                {suffix}
              </span>
            ) : null}
            <RatingButtons
              value={rating}
              onValueChange={(nextRating) => {
                setRating(nextRating);
                setOpen(true);
              }}
            />
          </div>
          {/* 表单区常驻挂载，用 0fr→1fr 的 grid 行过渡实现高度动画：
              收起时高度与宽度同时还原，不再出现「淡出后高度瞬间跳回」的突兀感。 */}
          <div
            data-slot="feedback-form-region"
            data-state={open ? "open" : "closed"}
            aria-hidden={open ? undefined : "true"}
            inert={!open}
            className={cn(
              "grid w-full transition-[grid-template-rows] duration-(--uni-duration-fast) ease-snap motion-reduce:transition-none",
              open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <div className="min-h-0 overflow-hidden">
              <FeedbackForm {...formProps} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-fit", className)} {...props}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          data-slot="feedback-trigger"
          type="button"
          className={buttonVariants({ type: "secondary", size: "small", className: "h-8" })}
        >
          {prefix ? (
            <span className="mr-2 flex size-3.5 shrink-0 items-center justify-center" aria-hidden>
              {prefix}
            </span>
          ) : null}
          <span className="inline-block truncate">{label ?? t("Feedback")}</span>
          {suffix ? (
            <span className="ml-2 flex size-3.5 shrink-0 items-center justify-center" aria-hidden>
              {suffix}
            </span>
          ) : null}
        </Popover.Trigger>
        <Popover.Portal>
          <LayerPopoverContent
            data-material="floating"
            data-slot="feedback-popup"
            role="dialog"
            align="center"
            // 该浮层通常挂在页面底部，默认向下弹会被视口底边裁切；优先向上，
            // 上方空间不足时由 avoidCollisions 翻转到下方。
            side="top"
            avoidCollisions
            collisionPadding={16}
            sideOffset={8}
            className={cn(
              "z-[var(--uni-z-popover)] w-[340px] max-w-[calc(100vw-32px)] overflow-hidden rounded-xl bg-background-100 shadow-[var(--material-shadow-menu)] outline-none",
              "origin-(--radix-popover-content-transform-origin) data-[state=open]:animate-in data-[state=open]:ease-out data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:ease-in data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-(--uni-duration-fast) motion-reduce:animate-none!",
            )}
          >
            <FeedbackForm {...formProps} />
          </LayerPopoverContent>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}

export { Feedback, FEEDBACK_TOPICS };
export type {
  FeedbackProps,
  FeedbackRatingValue,
  FeedbackType,
  FeedbackMetadata,
  FeedbackSubmitHandler,
  FeedbackTopic,
  FeedbackTopicChangeHandler,
};
