/**
 * 文档站 Components 数据（docs/geist 专用）。
 * 13 个已实现元件的元数据：路由 slug / 显示名 / 一句说明 / 官方对应组件名 / 用法代码片段。
 * 代码片段为「精简用法示例」字符串，详情页代码块展示，与根元件 API 保持一致。
 */

export interface ComponentMeta {
  /** 路由 slug（与侧栏 /components/:name 一致） */
  name: string;
  /** 侧栏 / 卡片显示名 */
  label: string;
  /** 一句说明（总览卡片 + 详情页副标题） */
  description: string;
  /** 官方 Geist（或 Penpot Core）对应组件名 */
  official: string;
  /** 用法 TSX 片段（详情页代码块，font-mono 展示） */
  code: string;
  /** Best Practices 要点（详情页底部列表） */
  bestPractices?: string[];
}

export const COMPONENTS: ComponentMeta[] = [
  {
    name: "avatar",
    label: "Avatar",
    description: "Represents a user or a team with an image or fallback.",
    official: "Avatar",
    code: `import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

<Avatar>
  <AvatarImage src="/avatar.png" alt="User" />
  <AvatarFallback>U</AvatarFallback>
</Avatar>`,
    bestPractices: [
      "Use Avatar to represent a single user or team. Stacked Avatars represent a group of people.",
      "Provide a fallback (initials, icon, or placeholder) so the avatar still reads when the image fails to load or is missing.",
      "Set a meaningful alt text on AvatarImage so screen readers announce who the avatar depicts.",
      "Match the size to the context: sm for dense rows, default for lists and mentions, lg for profile headers.",
    ]
  },
  {
    name: "banner",
    label: "Banner",
    description: "A prominent message that spans the full width of its container to announce important information.",
    official: "Banner",
    code: `import { Banner, BannerContent, BannerClose } from "@/components/ui/banner";

<Banner>
  <BannerContent>
    <b>Big News</b> – New components finally available
  </BannerContent>
  <BannerClose />
</Banner>`,
  },
  {
    name: "book",
    label: "Book",
    description: "A book-shaped container with flip-through pages.",
    official: "Book",
    code: `import { Book, BookPage } from "@/components/ui/book";

<Book title="The user experience of the Frontend Cloud">
  <BookPage title="Cover">Cover content</BookPage>
  <BookPage title="Chapter 1">Chapter content</BookPage>
</Book>`,
    bestPractices: [
      "Use Book for marketing pages, docs landing covers, and changelog hero shots where content needs the metaphor of a labeled volume.",
      "For in-product cards and dashboard tiles, use Card; Book is too decorative for repeated UI rows.",
      "Treat the cover as decorative chrome and surface the title via the underlying heading element so screen readers don't double-announce.",
    ],
  },
  {
    name: "browser",
    label: "Browser",
    description: "Frames screenshots and demos inside a realistic browser window.",
    official: "Browser",
    code: `import { Browser, BrowserHeader, BrowserAddressBar, BrowserContent } from "@/components/ui/browser";

<Browser>
  <BrowserHeader>
    <BrowserAddressBar>https://vercel.com</BrowserAddressBar>
  </BrowserHeader>
  <BrowserContent>Screenshot or demo content</BrowserContent>
</Browser>`,
    bestPractices: [
      "Use Browser as marketing chrome around screenshots, demos, and recordings shown on landing pages, docs, and changelog posts.",
      "Don't render real product UI inside a Browser frame; the chrome implies a screenshot, not a live surface.",
      "The browser chrome is decorative and should carry aria-hidden; meaning lives on the inner image or video.",
    ],
  },
  {
    name: "breadcrumbs",
    label: "Breadcrumbs",
    description: "Navigation aid that shows the user's location within a site's hierarchy.",
    official: "Breadcrumbs",
    code: `import {
  Breadcrumbs,
  BreadcrumbsItem,
  BreadcrumbsLink,
  BreadcrumbsSeparator,
} from "@/components/ui/breadcrumbs";

<Breadcrumbs>
  <BreadcrumbsItem>
    <BreadcrumbsLink href="#">Home</BreadcrumbsLink>
  </BreadcrumbsItem>
  <BreadcrumbsSeparator />
  <BreadcrumbsItem>
    <BreadcrumbsLink href="#">Dashboard</BreadcrumbsLink>
  </BreadcrumbsItem>
  <BreadcrumbsSeparator />
  <BreadcrumbsItem aria-current="page">Overview</BreadcrumbsItem>
</Breadcrumbs>`,
  },
  {
    name: "badge",
    label: "Badge",
    description: "Small labels for statuses, counts, and metadata.",
    official: "Badge",
    code: `import { Badge } from "@/components/ui/badge";

<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="ghost">Ghost</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="success">Success</Badge>`,
    bestPractices: [
      "Use Badge for short, scannable metadata that sits next to the thing it describes: status, plan tier, environment, or role. One badge per row; two side by side is a sign the row needs a second column.",
      "For a colored dot without text, use Status Dot. For clickable filter chips that toggle a query, use the pill variant or a small Button.",
      "Badges are static labels. Don’t wire onClick onto them; promote to a Button or link if the user can act on the value.",
      "Keep badge content to text or icon + text. Never stack two icons or a child Badge inside a Badge.",
      "Pair lifecycle badges (Alpha, Beta, Early Access) with a Tooltip that names the limit, like Alpha: API may change before GA.",
      "Title Case, one word when possible, two max: Active, Pending, Pro, Enterprise Trial. Match the canonical API or log term: Production not Prod, Deployed not Live, Canceled not Cancelled (the Vercel API uses one L).",
      "Don’t add a checkmark icon for success states or an X for errors; the variant carries that signal. Map meaning to color: green for healthy, red for error, amber for warning, blue for informational or production, gray for neutral. The -subtle suffix tones any of them down on dense surfaces.",
      "Skip stuffing sentences inside (Currently Active, You are on Pro); the surrounding row supplies the context.",
      "Set title for icon-only or ambiguous badges so screen readers announce the meaning. Don’t rely on color alone; the text has to be readable without it.",
    ]
  },
  {
    name: "button",
    label: "Button",
    description: "Triggers an action with configurable variants, sizes, and icons.",
    official: "Button",
    code: `import { Button } from "@/components/ui/button";

<Button>Default</Button>
<Button variant="outline" size="sm">Small</Button>
<Button variant="secondary" size="lg">Large</Button>
<Button variant="ghost" prefix={<Search />}>Search</Button>
<Button variant="destructive" loading>Delete</Button>
<Button disabled>Disabled</Button>`,
    bestPractices: [
      "Use Button for actions that mutate state (deploy, save, delete); use ButtonLink for navigation that changes the URL. Switch to a Menu or Split Button when more than one related action shares a row.",
      "Default Button is primary. Pass type=\"secondary\" for the supporting action and type=\"error\" for destructive confirmations. primary, success, ghost, and violet are not valid type values.",
      "For form submits, use typeName=\"submit\". The HTML type attribute lives on typeName, not on type, which controls the visual variant.",
      "Pass loading instead of swapping in a spinner so the button stays focusable and announces the busy state to assistive tech.",
      "Disable a button only when the action is impossible right now (missing input, insufficient permission); pair with a Tooltip that explains why.",
      "Title Case the label and name what happens: Deploy Project, Invite Member, Rotate Key. Avoid bare verbs (Submit) and generic confirms (OK, Confirm).",
      "Destructive buttons follow Verb + Noun and pair 1:1 with their toast: Delete Project then Project deleted. Mode-switch buttons append Instead: Use a Recovery Code Instead.",
      "Icon-only buttons require both svgOnly and aria-label; the validator throws without them. The aria-label names the action and the target (Copy deployment URL), not the icon (Copy).",
      "Don’t set aria-label on a button that already has visible text; it overrides the label and creates a screen-reader mismatch.",
    ]
  },
  {
    name: "calendar",
    label: "Calendar",
    description: "Displays a month calendar from which users can pick a date.",
    official: "Calendar",
    code: `import { Calendar } from "@/components/ui/calendar";

<Calendar />`,
    bestPractices: [
      "Pick Calendar for analytics ranges and any picker where day-of-week and month context matter.",
      "Set min and max to the data window so users can't pick outside the retention range.",
      "Default to the user's locale and timezone; never silently render UTC for a US-Pacific viewer.",
    ]
  },
  {
    name: "choicebox",
    label: "Choicebox",
    description: "A larger form of Radio for choices with more detail.",
    official: "Choicebox",
    code: `import { Choicebox, ChoiceboxItem, ChoiceboxLabel, ChoiceboxDescription } from "@/components/ui/choicebox";

<Choicebox defaultValue="pro" aria-label="select a plan">
  <ChoiceboxItem value="trial">
    <ChoiceboxLabel>Pro Trial</ChoiceboxLabel>
    <ChoiceboxDescription>Free for two weeks</ChoiceboxDescription>
  </ChoiceboxItem>
  <ChoiceboxItem value="pro">
    <ChoiceboxLabel>Pro</ChoiceboxLabel>
    <ChoiceboxDescription>Get started now</ChoiceboxDescription>
  </ChoiceboxItem>
</Choicebox>`,
    bestPractices: [
      "Use Choicebox when a choice benefits from a larger tap target plus a description or icon.",
      "Single-select for mutually exclusive choices, multi-select for additive ones. Don't mix the two within one group.",
      "Cap at 4-6 tiles. Past that, switch to Select or Combobox so the page doesn't scroll for a single field.",
    ]
  },
  {
    name: "checkbox",
    label: "Checkbox",
    description: "Allows users to select one or more items from a group.",
    official: "Checkbox",
    code: `import { Checkbox } from "@/components/ui/checkbox";

<Checkbox id="checked" checked />
<Checkbox id="unchecked" />
<Checkbox id="partial" indeterminate />`,
    bestPractices: [
      "Multi-select inside a list, like table-row pickers, multi-pick filters, and opt-in preference groups.",
      "Acknowledgments where the user must affirm a specific statement (terms of service, irreversible export).",
      "For a single boolean setting like dark mode or password protection, use Toggle. The on/off mechanic is clearer there than a lone checkbox.",
      "Indeterminate is a visual state, not a third value. Drive it from a parent that knows partial selection, and clear it as soon as every child is fully checked or unchecked.",
      "Validation on a required acknowledgment fires on submit, not on blur, so checking and unchecking shouldn’t flash an error.",
      "Disabled checkboxes still need a Tooltip naming the reason; a greyed box with no explanation reads as a bug.",
      "Group label above a <fieldset> is a Title Case noun like Notifications or Required Permissions. No trailing colon.",
      "Acknowledgment label is a full sentence ending in a period: I agree to the Terms of Service.",
      "Indeterminate copy names the partial count next to the group label (3 of 5 selected). Never leave the dash state unlabeled.",
      "Wrap related checkboxes in <fieldset> with a <legend> so screen readers announce the group name before each option.",
      "Row-select checkbox in a table has no visible label. Set aria-label=\"Select {row name}\" so the row stays identifiable out of context.",
      "The click target already extends to the label. Don’t override the <label>/htmlFor association with a custom wrapper that breaks the click region.",
    ]
  },
  {
    name: "collapse",
    label: "Collapse",
    description: "A vertically stacked set of headings that each reveal a related section of content.",
    official: "Collapse",
    code: `import { Collapse, CollapseTrigger, CollapseContent } from "@/components/ui/collapse";

<Collapse>
  <CollapseTrigger>Question A</CollapseTrigger>
  <CollapseContent>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
  </CollapseContent>
</Collapse>`,
    bestPractices: [
      "Use Collapse for optional, advanced, or repetitive content that most users skip on most visits (FAQ, advanced settings, request payload preview).",
      "For top-level structure that every user reads, use page sections with regular headings; collapsing primary content hides what the page is about.",
      "Default state is closed unless the first-time visitor must read the content to act.",
      "Animate the open/close transition; jump-cuts make the page feel like it teleported.",
      "Don’t nest Collapse more than one level deep. Two-level nesting hides too much and breaks the keyboard tab path.",
      "Heading is Title Case and names the topic, not the action (Advanced Settings, not Show Advanced Settings).",
      "Don’t put primary destructive actions inside a closed Collapse; the user has to click twice to reach the warning.",
      "The trigger is a <button> with aria-expanded that flips on toggle and aria-controls pointing at the panel id.",
      "Render the panel content in the DOM when closed (with hidden or visibility) so search and find-in-page still hit it; lazy-render only for expensive content.",
    ]
  },
  {
    name: "description",
    label: "Description",
    description: "Displays key/value metadata pairs as a definition list.",
    official: "Description",
    code: `import { Description, DescriptionItem, DescriptionKey, DescriptionValue } from "@/components/ui/description";

<Description>
  <DescriptionItem>
    <DescriptionKey>Last Deployed</DescriptionKey>
    <DescriptionValue>2h ago</DescriptionValue>
  </DescriptionItem>
  <DescriptionItem>
    <DescriptionKey>Region</DescriptionKey>
    <DescriptionValue>iad1</DescriptionValue>
  </DescriptionItem>
</Description>`,
    bestPractices: [
      "Use <Description> for definition-list metadata: a short Title Case key paired with a single value (Last Deployed, Region, Plan). For inline help under a form field, use the input’s helper-text slot instead.",
      "Geist renders <dl>/<dt>/<dd> so screen readers announce each key/value pair as a definition. Don’t wrap the component in extra paragraphs that break the list semantics.",
      "Key is a Title Case noun (Last Deployed, Build Duration); value is sentence case unless it’s a literal identifier, ID, or timestamp that should be preserved verbatim.",
      "Pass tooltip only when the key alone is ambiguous and a one-sentence definition resolves it. The tooltip text is sentence case and ends with a period.",
      "Don’t put interactive controls in the key slot. Buttons, menus, and links belong in the value or the parent layout, not the label.",
    ],
  },
  {
    name: "copy-button",
    label: "Copy Button",
    description: "Copies a given string to the clipboard and provides feedback when copied.",
    official: "Copy Button",
    code: `import { CopyButton } from "@/components/ui/copy-button";

<CopyButton text="lipsum" />`,
    bestPractices: [
      "Use CopyButton for a single short string the user copies verbatim — a token, a command, an ID. For longer blocks, pair a full Snippet with its own copy affordance.",
      "Show the checkmark feedback for about 1.5s after a successful copy so the action reads as done; reset it before the next click.",
      "Set aria-label on the icon-only button so screen readers announce the action (Copy deployment URL), not just the icon.",
      "Prefer navigator.clipboard.writeText with a hidden-textarea execCommand fallback so copying still works where clipboard permissions are missing.",
    ]
  },
  {
    name: "dropdown-menu",
    label: "Dropdown Menu",
    description: "Displays a list of actions in a floating menu.",
    official: "Dropdown Menu",
    code: `import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Actions</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Duplicate</DropdownMenuItem>
    <DropdownMenuItem>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
    bestPractices: [
      "Use Menu for a discoverable trigger that opens a list of actions on a single resource (a dots menu on a row, a dropdown on a primary entity).",
      "For right-click or long-press on a row, use ContextMenu. For global commands behind ⌘K, use CommandMenu. For two related primary actions, use a split button rather than burying the secondary action.",
      "Cap a Menu around 10 items. Past that, group with MenuSection or move secondary actions to a settings page.",
      "Open on click, not hover; hover-open menus collide with screen readers and trackpad scrolls.",
      "Position auto-flips based on window bounds; don’t hardcode a side that clips on narrow viewports.",
      "Close on item activation, Escape, and outside-click. Don’t auto-close on a hover-out.",
      "Use MenuItemLocked for permission-gated actions so the lock icon and disabled state explain why the row is inert.",
      "Item children are Title Case Verb + Noun (Rename Project, Duplicate Deployment). Bare verbs like Rename or Edit are wrong outside obvious single-object context.",
      "End an item with … only when activating it opens a follow-up dialog (Rename…, Transfer to Team…).",
      "Group destructive items at the bottom, separated by a divider, and keep the destructive copy as Verb + Noun (Delete Project, never bare Delete).",
      "Section headers (MenuSection title) are Title Case, 1–2 words (Workspace, Recent Projects).",
      "Up/Down arrows move focus through items, Home/End jump to first/last, Enter or Space activates.",
      "Typeahead jumps to the next item whose label starts with the typed character; keep the visible label first so typeahead matches what the user sees.",
      "Return focus to the trigger on close so keyboard users keep their place in the row.",
    ]
  },
  {
    name: "drawer",
    label: "Drawer",
    description: "Displays content in a separate bottom view from the existing context.",
    official: "Drawer",
    code: `import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";

<Drawer>
  <DrawerTrigger asChild>
    <Button>Open Drawer</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Filter Logs</DrawerTitle>
      <DrawerDescription>Narrow the logs by environment.</DrawerDescription>
    </DrawerHeader>
    <DrawerFooter>
      <DrawerClose asChild>
        <Button variant="secondary">Cancel</Button>
      </DrawerClose>
      <Button>Apply</Button>
    </DrawerFooter>
  </DrawerContent>
</Drawer>`,
    bestPractices: [
      "Only use Drawer on small viewports. For a desktop side panel that keeps the page interactive, use Sheet; for a blocking decision, use Modal.",
      "Don’t use Drawer to confirm destructive actions. The lack of a fully blocking dim weakens the severity signal that delete and revoke flows need; route to Modal.",
      "A Drawer is good for short focused mobile actions: a single form, a filter sheet, a primary CTA paired with Cancel.",
      "Tap-outside and swipe-down dismiss by default; preserve both unless the form has dirty input.",
      "DrawerTitle is a Title Case statement that names the entity (Deployment Details, Filter Logs). Body is sentence case prose with one primary Verb + Noun button and a literal Cancel.",
      "Trap focus inside the drawer while open and return focus to the trigger on close. Escape closes the drawer.",
      "Lock body scroll on open and restore it on close so iOS rubber-band scroll doesn’t leak through.",
    ]
  },
  {
    name: "empty-state",
    label: "Empty State",
    description: "Fills spaces when no content has been added yet or a view is empty.",
    official: "Empty State",
    code: `import { EmptyState, EmptyStateIcon, EmptyStateTitle, EmptyStateDescription } from "@/components/ui/empty-state";
import { Inbox } from "lucide-react";

<EmptyState>
  <EmptyStateIcon><Inbox /></EmptyStateIcon>
  <EmptyStateTitle>No results</EmptyStateTitle>
  <EmptyStateDescription>Clear your filters to see all logs.</EmptyStateDescription>
</EmptyState>`,
    bestPractices: [
      "Pick the variant by what the user needs: no-results for a filtered list that returned zero rows, blank slate or informational for a resource the user hasn’t created, cleared for completed work, error for a failed load.",
      "Render the permission and tier-denial variants full-page when the user lands on a route they can’t view.",
      "Don’t put critical persistent warnings here. Empty states vanish when the list populates; persistent warnings belong in a Note or the page header.",
      "title is Title Case; description is sentence case and adds new information instead of restating the title.",
      "Cap at one primary CTA, plus one secondary. Three CTAs is a smell.",
      "After an async filter change, wrap the region in aria-live=\"polite\" so screen readers announce the new state.",
    ]
  },
  {
    name: "error",
    label: "Error",
    description: "Provides a friendly, actionable message when an operation fails.",
    official: "Error",
    code: `import { ErrorText } from "@/components/ui/error";

<ErrorText>This email address is already in use.</ErrorText>

<Input aria-invalid placeholder="Email" />
<ErrorText>Email address is required.</ErrorText>`,
    bestPractices: [
      "Use the Error component as a block surface when a section or page-level resource failed to load: a panel, a dashboard card, a route boundary.",
      "Pick toasts.error() for transient action failures and the error prop on Input for field-level validation. Don't replace either with this block.",
      "Always pair platform or system errors with a stable identifier (request ID, deployment ID, run ID, trace ID). Validation and permission denials are user-state and don't need an ID.",
      "State what happened and what to do next, in that order. Cut apologetic preambles (Unfortunately, Oops, We're sorry).",
      "Use Couldn't or Can't for user-state errors; use Failed to for system or infra errors. Unable to is banned.",
      "Don't fall back to Something Went Wrong as a title; name the resource that failed (Couldn't Load Deployments).",
      "When the error appears asynchronously after a failed fetch, wrap the region in aria-live=\"polite\" so it's announced; reserve assertive for true blocking errors.",
    ]
  },
  {
    name: "fieldset",
    label: "Fieldset",
    description: "Groups related form controls into a single semantic unit.",
    official: "Fieldset",
    code: `import { FieldSet, FieldSetLegend, FieldSetItem, FieldSetLabel } from "@/components/ui/fieldset";
import { Input } from "@/components/ui/input";

<FieldSet>
  <FieldSetLegend>Account Settings</FieldSetLegend>
  <FieldSetItem>
    <FieldSetLabel htmlFor="name">Name</FieldSetLabel>
    <Input id="name" placeholder="Your name" />
  </FieldSetItem>
</FieldSet>`,
    bestPractices: [
      "Wrap related form controls in a <fieldset> with a <legend> so screen readers announce the group name before each option.",
      "The legend is a Title Case noun like Account Settings or Required Permissions. No trailing colon.",
      "Keep each FieldSetItem to one control plus its label on a single row; stack multiple items vertically for longer forms.",
      "FieldSet renders the native fieldset/legend semantics for accessible grouping, with Geist tokens for the legend and item layout.",
    ]
  },
  {
    name: "input",
    label: "Input",
    description: "A single-line text field for user input.",
    official: "Input",
    code: `import { Input } from "@/components/ui/input";

<Input placeholder="Name" />
<Input placeholder="Disabled" disabled />`,
    bestPractices: [
      "Pick <Input> for a single line of free-form text such as names, domains, or tokens.",
      "Switch to Textarea the moment content can wrap to multiple lines.",
      "Use Combobox when the value comes from a known list the user filters by typing.",
      "For an inline search box, set the search variant with a scoped placeholder like Search projects; don’t embed a <SearchInput> inside an unrelated form.",
      "Validate on blur, not on every keystroke; surface the message by passing a string to error.",
      "Trim leading and trailing whitespace before submit so example.com and example.com resolve to one value.",
      "Keep the field focusable while saving; pair disabled with a spinner only when input is impossible.",
      "Don’t wrap a labelled <Input> in a Tooltip; put the explainer on a sibling icon button so the label stays announced.",
      "Labels are short Title Case nouns: Project Name, Domain, Environment Variable Name.",
      "Placeholders show an example value (my-awesome-project, example.com), never instructions like Enter your project name.",
      "Helper text is sentence case, one sentence with a trailing period, on a sibling element wired through aria-describedby.",
      "Validation names the field and the constraint, ends in a period, and skips please (Project name is required., Code must be 6 digits.).",
      "Passing a string to label requires id; the InputPropsWithStringLabelAndId union won’t compile without it and screen readers lose the association.",
      "For icon-only affordances inside a row of inputs, use <Button shape=\"circle\" svgOnly aria-label=\"…\"> rather than an unlabeled icon.",
      "A SearchInput placeholder names the scope (Search projects) so the role is clear without sighted context.",
    ]
  },
  {
    name: "json-view",
    label: "JsonView",
    description: "Renders JSON as a syntax-highlighted tree.",
    official: "JsonView",
    code: `import { JsonView } from "@/components/ui/json-view";

const data = { deployment: { id: "dpl_1", state: "ready" }, cached: false };

<JsonView data={data} />`,
    bestPractices: [
      "Use JSON View for JSON objects or arrays that users need to inspect, scan, collapse, expand, select, or copy.",
      "Use a regular code block when the value is static documentation, not an interactive product surface.",
      "Keep the source data as an object or array. Do not pre-stringify JSON before passing it to data.",
    ]
  },
  {
    name: "loading-dots",
    label: "Loading Dots",
    description: "Indicates an action running in the background with three bouncing dots.",
    official: "Loading Dots",
    code: `import { LoadingDots } from "@/components/ui/loading-dots";

<LoadingDots />`,
    bestPractices: [
      "Use Loading Dots embedded in copy for short indeterminate waits, e.g. Saving<LoadingDots /> or Building<LoadingDots />.",
      "For buttons, set the loading prop on Button instead of dropping dots inside the label.",
      "For layout placeholders use Skeleton; for known progress use Progress; for icon-sized indeterminate waits use Spinner.",
      "Keep the trailing label specific to the work in flight (Saving, Deploying, Uploading) so a wait over ~1s still tells the user what’s happening.",
      "Don’t string Loading Dots after a completed verb (Saved<LoadingDots />); the dots imply ongoing work.",
      "Mark the wrapping span with aria-live=\"polite\" so screen readers pick up the in-progress label without interrupting.",
      "The dots are decorative; the surrounding text carries meaning, so don’t add aria-label to the component itself.",
      "Honor prefers-reduced-motion and avoid pairing Loading Dots with another animated indicator on the same line.",
    ]
  },
  {
    name: "label",
    label: "Label",
    description: "Accessible text label for form controls.",
    official: "Label",
    code: `import { Label } from "@/components/ui/label";

<Label htmlFor="email">Email Address</Label>
<Input id="email" placeholder="Enter email address..." />`,
    bestPractices: [
      "Use Label to associate a visible text label with a form control so screen readers announce the field name.",
      "Match the label to the control via htmlFor and the control's id so clicking the label focuses the field.",
      "Keep labels short Title Case nouns: Project Name, Domain, Environment Variable Name.",
    ]
  },
  {
    name: "modal",
    label: "Modal",
    description: "Displays a dialog that interrupts the user.",
    official: "Modal",
    code: `import { Modal, ModalTrigger, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter, ModalClose } from "@/components/ui/modal";\n\n<Modal>\n  <ModalTrigger asChild>\n    <Button>Open Modal</Button>\n  </ModalTrigger>\n  <ModalContent>\n    <ModalHeader>\n      <ModalTitle>Delete Project</ModalTitle>\n      <ModalDescription>This action cannot be undone.</ModalDescription>\n    </ModalHeader>\n    <ModalFooter>\n      <ModalClose asChild>\n        <Button variant="secondary">Cancel</Button>\n      </ModalClose>\n      <Button variant="destructive">Delete</Button>\n    </ModalFooter>\n  </ModalContent>\n</Modal>`,
    bestPractices: [
      "Use Modal when a decision must block the rest of the page. For persistent associated context where the underlying page stays readable, use Sheet on desktop or Drawer on mobile.",
      "Confirm destructive actions in a Modal. Drawer and Sheet don't fully dim the page, so they read as too soft for a delete or revoke.",
      "Skip Modal for routine create flows that have a dedicated page; route to the page instead.",
      "Default focus to Cancel on any destructive Modal. Enter must never trigger the destructive action without a typed confirmation.",
      "Allow Escape and outside-click to dismiss non-destructive Modals; gate dismissal on destructive ones with unsaved input.",
      "Trap focus inside the Modal while it's open and return focus to the trigger after close. Restore body scroll on the same tick the Modal unmounts.",
      "For high-stakes destructive actions (delete production resource, rotate signing key, downgrade plan), gate the primary button on a typed match of the resource name.",
      "Modal.Title is a Title Case statement, never a question. Transfer Project is correct; Transfer Project? is wrong.",
      "Modal body copy is sentence case, 1-3 sentences. State the consequence first, then any cascade.",
      "Primary button is Verb + Noun and matches the title verb (Transfer Project title pairs with Transfer Project button). Never Confirm, OK, or a bare verb on a destructive primary.",
      "Cancel literal stays Cancel. Acknowledgment-only Modals (after a key reveal, after a one-time-show) use Done, never OK or Close.",
      "Close irreversible bodies with This cannot be undone.; close cascade-only bodies with Some effects cannot be undone. Don't claim full irreversibility for a partial cascade.",
      "Pair the success toast verb 1:1 with the primary button: Delete Project button, Project deleted toast.",
      "Set aria-labelledby to the Modal.Title id so screen readers announce the title on open.",
      "Keep the Cancel button literally Cancel so screen-reader users hear a stable dismissal label across destructive flows.",
      "After an error inside the Modal, keep focus inside so the user can retry; after success, return focus to the trigger.",
    ],
  },
  {
    name: "note",
    label: "Note",
    description: "Displays text that requires attention or provides additional information.",
    official: "Note",
    code: `import { Note } from "@/components/ui/note";

<Note>Changing this region restarts all functions.</Note>
<Note variant="success">Deployment succeeded.</Note>
<Note variant="warning">Your plan has a usage limit.</Note>
<Note variant="destructive">The API key is invalid.</Note>`,
    bestPractices: [
      "Use a Note for inline contextual feedback next to the field, card, or section it describes: a region change warning above a region picker, a rate-limit notice next to a usage gauge.",
      "Pick Banner when the message is page-level or system-wide and needs a CTA, Toast for transient acknowledgments, Modal for destructive confirmations.",
      "Choose variant by meaning: destructive for a problem the user must fix, warning for a consequence to acknowledge, success for a passed check; omit variant for the default info icon.",
      "A Note is persistent until the underlying state changes; don’t add an ad hoc dismiss control because it competes with the message.",
      "One Note per concept. Stacking three Notes on a card means the page architecture, not the Note copy, is wrong.",
      "The body is one sentence in active voice that names the impact: Changing this region restarts all functions.",
    ]
  },
  {
    name: "pagination",
    label: "Pagination",
    description: "Navigates through numbered pages of a data set.",
    official: "Pagination",
    code: `import {
  Pagination,
  PaginationList,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

<Pagination>
  <PaginationList>
    <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
    <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
    <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
    <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
    <PaginationItem><PaginationNext href="#" /></PaginationItem>
  </PaginationList>
</Pagination>`,
    bestPractices: [
      "Use Pagination for sequential navigation between sibling pages (docs articles, blog posts, onboarding steps). For revealing more rows of the same data set, use Show More or a numbered pager.",
      "Use a numbered pager (PaginationList of PaginationLink) when the data set spans many pages and users need to jump to a specific page.",
      "Mark the current page with isActive so it renders with aria-current=\"page\" and the selected highlight; keep other links as plain anchors.",
      "Hide the Previous / Next slot at the start or end of a sequence instead of disabling it; an empty rail reads cleaner than a dimmed link with nowhere to go.",
      "Keep page labels short — numbers or 1–2 words. Don’t restate ordinal positions like Page 3 of 10 inside a link.",
    ]
  },
  {
    name: "phone",
    label: "Phone",
    description: "Frames mobile screenshots inside a realistic phone shell.",
    official: "Phone",
    code: `import { Phone, PhoneScreen } from "@/components/ui/phone";

<Phone>
  <PhoneScreen>Mobile screenshot or demo content</PhoneScreen>
</Phone>`,
    bestPractices: [
      "Use Phone as marketing chrome around mobile screenshots, recordings, and demo images on landing pages and docs.",
      "Don't render live mobile product UI inside the frame; the chrome implies a captured screen, not an interactive surface.",
      "Treat the chrome as decorative (aria-hidden); accessible naming belongs on the inner screenshot.",
    ]
  },
  {
    name: "pill",
    label: "Pill",
    description: "Clickable filter chip for toggling a query or selection.",
    official: "Pill",
    code: `import { Pill } from "@/components/ui/pill";

<Pill variant="active">Active</Pill>
<Pill onClick={() => {}}>Inactive</Pill>
<Pill>Pending</Pill>`,
    bestPractices: [
      "Use Pill for clickable filter chips that toggle a query; for a static status label use Badge instead.",
      "Pass variant=\"active\" to highlight the currently selected filter so sighted users see the active state without color alone.",
      "Wire onClick only when the pill can actually filter; otherwise promote to a Badge.",
    ]
  },
  {
    name: "progress",
    label: "Progress",
    description: "Shows progress relative to a limit or a task.",
    official: "Progress",
    code: `import { Progress } from "@/components/ui/progress";

<Progress value={30} />
<Progress value={60} />
<Progress value={90} />`,
    bestPractices: [
      "Determinate work whose total is knowable, like file uploads, multi-step setup, build steps, or batch deletions.",
      "For short indeterminate waits (~1–3s), use Spinner; for inline copy like Saving, use Loading Dots.",
      "Use max for the real ceiling (max={files.length}), not a hardcoded 100. The component computes the percentage from value / max.",
      "Pair the bar with text naming the work and units: Uploading 12 of 30 files. The bar alone doesn’t say what’s progressing.",
    ]
  },
  {
    name: "radio",
    label: "Radio",
    description: "Provides single user input from a selection of options.",
    official: "Radio",
    code: `import { RadioGroup, RadioGroupItem, RadioGroupLabel } from "@/components/ui/radio";

<RadioGroup defaultValue="one" aria-label="Deployment Region">
  <RadioGroupItem value="one">Option 1</RadioGroupItem>
  <RadioGroupItem value="two">Option 2</RadioGroupItem>
</RadioGroup>`,
    bestPractices: [
      "A single choice from 2–6 mutually exclusive options where seeing every option matters (deploy regions, plan tiers, billing cycle).",
      "Past 6 options, switch to Select or Combobox so the list doesn't dominate the form.",
      "For binary on/off, use Toggle. For richer per-option content (icon, description, badge), use Choicebox.",
      "Pre-select the safest default so the field reads as configured, never as required-but-empty.",
      "Required state goes on the RadioGroup, not on individual options.",
      "Wrap related radios in <fieldset> + <legend> so screen readers announce the group name before each option.",
    ]
  },
  {
    name: "segmented-control",
    label: "Segmented Control",
    description: "A slider group for mutually exclusive view options.",
    official: "Segmented Control",
    code: `import { SegmentedControl } from "@/components/ui/segmented-control";

<SegmentedControl
  options={[
    { value: "preview", label: "Preview" },
    { value: "code", label: "Code" },
    { value: "split", label: "Split" },
  ]}
  value={view}
  onValueChange={setView}
  ariaLabel="编辑器视图"
/>`,
    bestPractices: [
      "Use Switch as a segmented selector for 2–3 mutually exclusive options that show different views of the same surface, like Source vs Output.",
      "For a boolean on/off setting, use Toggle. Switch implements radio semantics, so two options stay mutually exclusive rather than reading as a checkbox.",
      "Past 3 options or when labels grow beyond a couple of words, switch to Tabs or a Select.",
      "Pass a name so the underlying radios are grouped; without it, more than one option can appear selected at once.",
      "Set defaultChecked (or controlled checked) on exactly one Switch.Control so the group has a defined initial state.",
      "Pad each Switch.Control so the widest label fits without the active pill resizing on selection. Test with the longest copy in the set.",
      "Title Case each Switch.Control label. Keep labels to one or two words and parallel: Source / Output, not Source / Show output.",
      "Always provide a label on every Switch.Control, even when an icon carries the meaning, so screen readers announce the option. The component renders it as geist-sr-only for icon-only controls.",
      "Pair an icon-only Switch with a Tooltip on each control so sighted users get the same label assistive tech receives.",
    ]
  },
  {
    name: "sheet",
    label: "Sheet",
    description: "Displays content in a side panel that slides in from the edge of the screen.",
    official: "Sheet",
    code: `import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";

<Sheet>
  <SheetTrigger asChild>
    <Button>Open Sheet</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Deployment Details</SheetTitle>
      <SheetDescription>Inspect the latest production deployment.</SheetDescription>
    </SheetHeader>
    <SheetFooter>
      <SheetClose asChild>
        <Button variant="secondary">Close</Button>
      </SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>`,
    bestPractices: [
      "Use Sheet for persistent associated context like deployment details, log row inspection, or a member profile, where the underlying page stays useful.",
      "For a blocking decision, use Modal. For a mobile-only bottom sheet, use Drawer.",
      "Don’t use Sheet to confirm destructive actions. The default keeps the page interactive, which weakens severity for a delete or revoke.",
      "Pick side from the trigger location: a row inspector slides from right, a global filter from left. Don’t change sides mid-session.",
      "Outside-click does not auto-close, so always render an explicit close affordance and honor Escape.",
      "Title is Title Case and names the entity (Deployment Details, Member Profile), not the page action. Body is read-mostly prose.",
      "Trap focus inside the sheet while it’s open and return focus to the trigger row on close so keyboard users keep their place in the list.",
      "Provide a visible close button labeled Close (or an icon button with aria-label=\"Close\") since clicking outside doesn’t dismiss.",
      "Announce the sheet with aria-labelledby pointing at the title; pair it with aria-describedby only when the body is short and load-bearing.",
    ]
  },
  {
    name: "select",
    label: "Select",
    description: "Presents a list of options in a dropdown.",
    official: "Select",
    code: `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

<Select defaultValue="vercel">
  <SelectTrigger className="w-56">
    <SelectValue placeholder="Select a project" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="vercel">Vercel</SelectItem>
    <SelectItem value="nextjs">Next.js</SelectItem>
    <SelectItem value="turbo">Turborepo</SelectItem>
  </SelectContent>
</Select>`,
    bestPractices: [
      "Pick <Select> for short, fixed lists (under ~10 items) where typing adds nothing; switch to Combobox once filtering helps.",
      "Use MultiSelect when more than one value can be chosen at once; use Switch for a 2–3 option segmented choice.",
      "Group options past ~10 items with native <optgroup>; Geist <Select> has no .Group static.",
      "Options are Title Case when short and match canonical branding (Next.js, not NextJS); keep the same register across the list.",
      "Label is a short Title Case noun (Framework, Region); accept the prop directly on <Select>.",
      "Placeholder is action-oriented (Select a framework), never Choose one…, Pick, or the label restated.",
      "Validate on blur and pass a string to error; messages name the field and end in a period (Select a framework.).",
      "Don’t wrap a labelled <Select> in a Tooltip; put the hint on a sibling icon button so the label stays announced.",
    ]
  },
  {
    name: "separator",
    label: "Separator",
    description: "Divides content into visually distinct groups.",
    official: "Separator",
    code: `import { Separator } from "@/components/ui/separator";

<Separator />

<div className="flex h-10 items-center gap-3">
  <span>Left</span>
  <Separator orientation="vertical" />
  <span>Right</span>
</div>`,
    bestPractices: [
      "Use Separator to divide content into visually distinct groups, like between sections of a list or menu items.",
      "Horizontal separators span the full width of their container; vertical ones fill the available height of a flex row.",
      "Separators are decorative by default (decorative prop), so assistive tech ignores them. Set decorative={false} with an accessible name only when the separation is semantically meaningful.",
      "Don’t overuse separators; grouping with white space or a background surface is often enough and reads cleaner.",
    ]
  },
  {
    name: "show-more",
    label: "Show More",
    description: "Shows expanded or collapsed content with a progressive-disclosure trigger.",
    official: "Show More",
    code: `import { ShowMore } from "@/components/ui/show-more";

<ShowMore
  preview="A short preview of the content…"
>
  The full content revealed after clicking Show more.
</ShowMore>`,
    bestPractices: [
      "Use ShowMore for progressive disclosure of a single long list or block (recent activity, repo branches, attached resources). For sibling pages of the same data set, use Pagination; for optional sections, use Collapse.",
      "Show enough rows to convey the shape of the list before truncating (5–10 typical). Truncating at 2 makes the affordance feel performative.",
      "Pair the trigger with the count of hidden items so the user knows the cost of expanding (Show 12 More, then Show Less after expand). Title Case both labels.",
      "Don’t cycle Show More then Show Less mid-flow on the same data set; collapsing rows after the user expanded them scrolls them away from where they were reading.",
      "Render hidden rows in the DOM when the count is small so find-in-page works; lazy-load only when the dataset is large enough to hurt initial render.",
      "The trigger is a <button> with aria-expanded and aria-controls pointing at the list. After expansion, move focus to the first newly revealed row so screen readers and keyboard users land in the new content.",
    ]
  },
  {
    name: "skeleton",
    label: "Skeleton",
    description: "Displays a placeholder while content is loading.",
    official: "Skeleton",
    code: `import { Skeleton } from "@/components/ui/skeleton";

<Skeleton className="h-4 w-32" />`,
    bestPractices: [
      "Show a Skeleton when async data fills a known layout: table rows, card grids, profile blocks, sidebars.",
      "For a single in-flight action, use Spinner; for known progress, use Progress.",
      "Set width and height to match the final content so the layout doesn’t shift when data resolves.",
      "Wrap the loading region in aria-busy=\"true\" and announce completion with aria-live=\"polite\" on the destination container.",
      "Respect prefers-reduced-motion for the pulse animation on low-power surfaces.",
    ]
  },
  {
    name: "snippet",
    label: "Snippet",
    description: "Displays a runnable shell command or short code the user is meant to copy.",
    official: "Snippet",
    code: `import { Snippet } from "@/components/ui/snippet";

<Snippet code="npm i geist" />
<Snippet code="vercel link" />`,
    bestPractices: [
      "Use Snippet for a runnable shell command the user is meant to copy. For inline tokens (env var names, paths) use InlineCode, and for multi-line source use CodeBlock.",
      "Pass the command as text. The component renders any prompt itself; keep the copied payload in sync with what the user sees.",
      "Keep one command per Snippet. For longer scripts, switch to CodeBlock so users can read before they copy.",
      "Pair Snippet with a CopyButton affordance so users can grab the command without selecting text manually.",
    ]
  },
  {
    name: "spinner",
    label: "Spinner",
    description: "Indicates an in-progress operation.",
    official: "Spinner",
    code: `import { Spinner } from "@/components/ui/spinner";

<Spinner />
<Spinner size="sm" />
<Spinner size="lg" />`,
    bestPractices: [
      "Use Spinner for a single in-flight action or indeterminate wait where there’s no known progress to show.",
      "For a known duration or percentage, use Progress instead of a spinner.",
      "Prefer a loading state on the action control itself (like Button loading) so the busy element stays focusable.",
      "Pair a standalone Spinner with a text label or aria-label so the loading state is announced to assistive tech.",
    ]
  },
  {
    name: "status-dot",
    label: "Status Dot",
    description: "Displays an indicator of deployment status.",
    official: "Status Dot",
    code: `import { StatusDot } from "@/components/ui/status-dot";

<StatusDot variant="default" />
<StatusDot variant="success" />
<StatusDot variant="warning" />
<StatusDot variant="destructive" />
<StatusDot variant="info" />`,
    bestPractices: [
      "Use Status Dot only for deployment lifecycle states: QUEUED | BUILDING | READY | ERROR | CANCELED | DELETED.",
      "For non-deployment statuses (Workflow runs, Queue messages, Sandbox, Cron jobs), use a Badge with the canonical state vocabulary instead of repurposing the dot.",
      "The dot animates while BUILDING or QUEUED and goes static once the deployment reaches a terminal state. Don’t add a separate spinner alongside it.",
      "Don’t flash the color through every transitional state on a polling tick; only update when the readyState changes.",
      "Mark the dot decorative with aria-hidden when it sits inline with text that already names the state, so screen readers don’t announce it twice.",
    ]
  },
  {
    name: "step-point",
    label: "Step Point",
    description: "Marks progress through a multi-step flow.",
    official: "StepPoint",
    code: `import { StepPoint } from "@/components/ui/step-point";

<ul>
  <StepPoint status="done">Submitted</StepPoint>
  <StepPoint status="active">Under review</StepPoint>
  <StepPoint status="idle">Approved</StepPoint>
</ul>`,
  },
  {
    name: "table",
    label: "Table",
    description: "Displays structured data in rows and columns.",
    official: "Table",
    code: `import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Vercel</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Next.js</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
    bestPractices: [
      "Use <Table> for tabular data where rows share the same shape and at least one column is sortable or comparable across rows.",
      "For a row of descriptive content paired with a single action (membership row, integration row), use Entity instead.",
      "For a key/value metadata block on a detail page, use Description, not a two-column table.",
      "When the underlying list is empty (filter cleared, never created), render Empty State outside the table rather than an empty <Table.Body>.",
      "Render — in cells where a value is unknown or not applicable. Don’t substitute N/A, null, or an empty string.",
      "Sortable column headers are buttons. The visible label stays Title Case; the sort-direction arrow is decorative and the button announces the next sort state to assistive tech.",
      "Apply tabular-nums (or Geist Mono) to numeric columns so digits align across rows for comparison.",
      "Column headers (<Table.Head>) are Title Case nouns or noun phrases: Last Used, Requests (7d), Created, Status. Never sentences.",
      "Use the canonical short relative-time form in cells (2m ago, 5h ago); switch to Mar 14, 2026 past 7 days. See Relative Time Card.",
      "Pagination labels are Previous and Next. Page-count copy reads Page 2 of 7 or 21–40 of 142 with an en-dash inside the range.",
    ]
  },
  {
    name: "tabs",
    label: "Tabs",
    description: "Organizes content into switchable panels.",
    official: "Tabs",
    code: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="usage">Usage</TabsTrigger>
    <TabsTrigger value="api">API</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
  <TabsContent value="usage">…</TabsContent>
  <TabsContent value="api">…</TabsContent>
</Tabs>`,
    bestPractices: [
      "Use Tabs to switch between sibling views inside a single page (Overview, Logs, Settings).",
      "For navigation between unrelated pages, use a sub-menu, not Tabs. Tabs imply the views share scope, URL parent, and data model.",
      "Cap a Tabs row at 5–7 entries on desktop and 3–4 on mobile. Past that, consolidate or move secondary views behind a Menu.",
      "Selecting a tab is instant; don’t trigger network confirmation or toast on tab change.",
      "Reflect the active tab in the URL (query param or path) so deep-links and refresh restore state.",
      "Disable individual tabs only for permission or empty-state reasons; pair the disabled tab with a tooltip that names the constraint.",
      "tabs[].title is Title Case, 1–2 words, and names the destination noun (Overview, Logs, Settings). Verbs belong on buttons; View Logs is wrong on a tab.",
      "tabs[].tooltip is sentence case and explains the constraint (Only visible to project owners.), not the tab’s purpose.",
      "Don’t append a count to the title (Logs (12)); use a badge slot instead and drop the badge at zero.",
      "Keep Left/Right arrows moving focus across tabs and Enter/Space activating; don’t hijack with global shortcuts.",
      "Label the tablist with aria-label when no visible heading sits above it (aria-label=\"Sections\").",
      "Maintain a visible focus ring on the active tab; don’t suppress focus styles for visual polish.",
    ]
  },
  {
    name: "textarea",
    label: "Textarea",
    description: "A multi-line text field for longer input.",
    official: "Textarea",
    code: `import { Textarea } from "@/components/ui/textarea";

<Textarea placeholder="Describe your project" />
<Textarea placeholder="Disabled" disabled />`,
    bestPractices: [
      "Pick <Textarea> for content that wraps to multiple lines (commit messages, descriptions, notes); use Input for a single value like a name or domain.",
      "Set a generous default rows and grow only when the surface has vertical room; don’t let the field push primary actions below the fold.",
      "Validate on blur and pass a string to error to render the inline message; the validation replaces helper text on failure.",
      "Trim leading and trailing whitespace on submit so empty newlines don’t pass a required check.",
      "Labels are short Title Case nouns (Description, Release Notes); placeholders show an example value, not instructions like Enter a description.",
      "Validation names the field and constraint, ends in a period, and skips please (Description is required., Release notes can’t exceed 500 characters.).",
      "Render helper text as a sibling <p> linked through aria-describedby; sentence case, one sentence, with a period.",
    ]
  },
  {
    name: "toast",
    label: "Toast",
    description: "A succinct message that is displayed temporarily.",
    official: "Toast",
    code: `import {
  Toast,
  ToastProvider,
  ToastTitle,
  ToastDescription,
  ToastViewport,
  ToastClose,
} from "@/components/ui/toast";

<ToastProvider swipeDirection="right">
  <Toast>
    <ToastTitle>Project deleted</ToastTitle>
    <ToastDescription>The Evil Rabbit jumped over the fence.</ToastDescription>
    <ToastClose />
  </Toast>
  <ToastViewport />
</ToastProvider>`,
    bestPractices: [
      "Use a toast for non-blocking acknowledgments of user-initiated actions: Domain added, Project archived, Deployment canceled.",
      "Don’t use a toast alone for billing failures, permission denials, or build failures the user has to triage. Pair a ≤6-word toast (Build failed) with a persistent row carrying the recovery step.",
      "Default toasts auto-dismiss; pass preserve only when the user must read or act on the message before it disappears.",
      "Don’t stack toasts to narrate one async flow; emit the success or error toast at the terminal step.",
      "One sentence, sentence case, no trailing period when the toast is a single sentence.",
      "Completion toasts follow {Noun} {past-participle}: Blob deleted, Domain added. Never include successfully.",
      "Error toasts are two sentences with periods and end with a recovery step: Couldn’t verify domain. Try again.",
      "Pair the toast verb 1:1 with the destructive button verb (Delete Project then Project deleted).",
      "The toast region announces with aria-live=\\\"polite\\\"; reserve assertive for blocking errors that interrupt a flow.",
    ]
  },
  {
    name: "toggle",
    label: "Toggle",
    description: "A switch for a single boolean setting.",
    official: "Toggle",
    code: `import { Toggle } from "@/components/ui/toggle";

<Toggle checked={enabled} onCheckedChange={setEnabled} />`,
    bestPractices: [
      "Use Toggle for a single boolean setting where ON takes effect immediately, like Password Protection or Auto-Cancel Builds. Switch to Checkbox for a multi-select list, or to Switch for 2–3 mutually exclusive views.",
      "checked is required and the component is controlled. Own the state and update it from onChange.",
      "Persist on change and surface the result in a useToasts().success(…) toast (Password protection enabled); don’t leave the user wondering whether the flip stuck. Pair with a form footer only when the setting needs an explicit Save step.",
      "Disable Toggle only when the action is impossible (missing plan, locked policy); pair with helper text or a Tooltip that names the resolver.",
      "The label is children, not a label prop. Title Case noun phrase, 1–4 words, naming what is true when ON: Password Protection, not Enable Password Protection.",
      "Render an optional one-sentence description as a sibling under the label that explains ON only. Don’t describe OFF; it’s the negation.",
      "Keep labelCasing=\"title\" (the default) so labels match other Title Case surfaces. Use labelCasing=\"normal\" only when sentence-case content sits inline next to the toggle.",
      "Provide an accessible name through children, aria-label, or aria-labelledby. Geist warns in development if all three are missing.",
      "Set aria-label only when the visible label sits elsewhere on the row; otherwise let children carry it so sighted and screen-reader copy stay aligned.",
    ]
  },
  {
    name: "tooltip",
    label: "Tooltip",
    description: "A floating label that appears on hover or focus.",
    official: "Tooltip",
    code: `import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>The Evil Rabbit Jumped over the Fence</TooltipContent>
  </Tooltip>
</TooltipProvider>`,
    bestPractices: [
      "Use a Tooltip to explain why something exists, not what it is. The visible label names the thing; the tooltip adds the constraint, scope, or limit.",
      "Tooltips open on hover and on keyboard focus. Keep the default ~150ms entry delay so the tooltip doesn’t flicker on a sweeping mouse.",
      "Don’t wrap a labelled Input in a Tooltip. The trigger lands on the <label>, not the field, and the tooltip text becomes a second invisible label for screen readers. Put help on a sibling icon button.",
      "Keep primary actions outside the Tooltip; touch users can’t reach a hover-revealed control.",
      "One sentence or fragment in text. Sentence case, no period for a single fragment.",
      "Skip tooltips that repeat the visible label (text=\"Rate Limit\" on a Rate Limit button) or describe the interaction (text=\"Click to override\").",
      "An icon-only trigger needs an aria-label that names the action; the Tooltip body adds context, it doesn’t replace the label.",
      "Escape closes the tooltip and returns focus to the trigger.",
    ]
  },
  {
    name: "theme-switch",
    label: "Theme Switch",
    description: "Switches between light, dark, and system themes.",
    official: "Theme Switcher",
    code: `import { ThemeSwitch } from "@/components/ui/theme-switch";

<ThemeSwitch />`,
    bestPractices: [
      "Use Theme Switcher for the canonical Light / System / Dark control. Place it once per app, in the footer or settings, not duplicated across pages.",
      "Pass small for dense chrome (footers, dropdowns); use the default size on a settings page where there’s room for the labels to breathe.",
      "Theme Switcher reads from and writes to next-themes, so wrap the app in GeistProvider once at the root and don’t mirror its state into local React state.",
      "The control auto-disables when forcedTheme is set on the provider; setting disabled manually is for read-only previews of the control itself.",
      "Don’t rebuild a theme picker with Switch or three icon buttons. Theme Switcher already handles the icons, the aria-label per option, and System detection.",
      "The component composes its own labels from the theme keys (light, system, dark); leave them alone so they stay translatable through next-themes.",
    ]
  },
  {
    name: "video",
    label: "Video",
    description: "Embeds a video with built-in playback controls.",
    official: "Video",
    code: `import { Video, VideoControls } from "@/components/ui/video";

<Video src="/demo.mp4" />`,
    bestPractices: [
      "Use Video to embed clips with built-in playback controls and lazy loading support.",
      "Lock the inner video aspect ratio so the container doesn't reflow while media loads.",
      "For autoplay, respect prefers-reduced-motion and provide a paused poster fallback.",
    ]
  },
];
