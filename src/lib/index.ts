// Unitary — Library Entry Point
// 仅导出实际存在的公开 API

// Styles (side-effect 导入，打包输出独立 styles.css)
import "../styles/index.css";

// Theme & i18n providers
export { ThemeProvider, useTheme } from "./theme";
export { I18nProvider, useI18n } from "./i18n";

// Font metrics probe
export { probeFontMetrics, useFontMetrics, measureFontMetrics, applyFontMetrics } from "./font-metrics";

// Utility
export { cn } from "./utils";
export {
  CIRCULAR_CORNER_EXPONENT,
  CONTINUOUS_CORNER_EXPONENT,
  continuousCornerPath,
  cornerCurvePoints,
  superellipsePath,
  useContinuousCorners,
} from "./continuous-corner";
export type { ContinuousCornerOptions, SuperellipseOptions } from "./continuous-corner";

// Components — Core (buttons, inputs, etc.)
export { Button, ButtonLink, CustomButton, buttonVariants } from "@/components/ui/button";
export type { ButtonProps, ButtonLinkProps, CustomButtonProps } from "@/components/ui/button";
export { Input } from "@/components/ui/input";
export type { InputProps, InputSize } from "@/components/ui/input";
export { Select, SelectItem, SelectGroup, SelectSeparator } from "@/components/ui/select";
export type { SelectProps } from "@/components/ui/select";
export { Switch, SwitchControl } from "@/components/ui/switch";
export type { SwitchProps, SwitchControlProps, SwitchSize } from "@/components/ui/switch";
export { Checkbox } from "@/components/ui/checkbox";
export { Calendar } from "@/components/ui/calendar";
export { Radio, RadioGroup, RadioGroupItem, useRadio } from "@/components/ui/radio";
export type { RadioProps, RadioGroupProps, RadioGroupItemProps } from "@/components/ui/radio";
export { Toggle } from "@/components/ui/toggle";
export type { ToggleProps } from "@/components/ui/toggle";
export { Tabs } from "@/components/ui/tabs";
export type { TabsProps, TabsTab, TabsVariant } from "@/components/ui/tabs";
export { Avatar, AvatarGroup, AvatarWithIcon, GitHubAvatar, GitLabAvatar, BitbucketAvatar } from "@/components/ui/avatar";
export { Badge, badgeVariants } from "@/components/ui/badge";
export { Separator } from "@/components/ui/separator";

// Components — Feedback
export { Toasts, useToasts } from "@/components/ui/toast";
export type { ToastKind, ToastOptions, UseToastsReturn, ToastsProps } from "@/components/ui/toast";
export { Tooltip } from "@/components/ui/tooltip";
export type { TooltipProps, TooltipPosition, TooltipBoxAlign, TooltipType } from "@/components/ui/tooltip";
export { Progress } from "@/components/ui/progress";
export type { ProgressProps, ProgressType, ProgressLabelPosition, ProgressStop } from "@/components/ui/progress";
export { Skeleton } from "@/components/ui/skeleton";
export type { SkeletonProps } from "@/components/ui/skeleton";
export { SkeletonMask } from "@/components/ui/skeleton-mask";
export type { SkeletonMaskProps } from "@/components/ui/skeleton-mask";
export { Spinner } from "@/components/ui/spinner";
export { LoadingDots } from "@/components/ui/loading-dots";
export type { SpinnerProps } from "@/components/ui/spinner";
export { EmptyState, EmptyStateIcon } from "@/components/ui/empty-state";

// Components — Data Display
export { Table, TableRoot, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption, TableColgroup, TableCol } from "@/components/ui/table";
export type { TableProps, TableHeaderProps, TableBodyProps, TableFooterProps, TableHeadProps, TableRowProps, TableCellProps, TableCaptionProps, AlignH, AlignV, TableAlign, TableColorScheme, MaybeAlign } from "@/components/ui/table";
export { Collapse, CollapseTrigger, CollapseContent } from "@/components/ui/collapse";
export { CodeBlock, CodeBlockHeader, CodeBlockContent } from "@/components/ui/code-block";
export { Code, InlineCode } from "@/components/ui/code";
export { CopyButton } from "@/components/ui/copy-button";
export { Description } from "@/components/ui/description";
export { Entity, EntityMedia, EntityContent, EntityTitle, EntityDescription, EntityAction } from "@/components/ui/entity";
export { ErrorCard, ErrorCardTitle, ErrorCardDescription, ErrorCardAction } from "@/components/ui/error-card";
export { ErrorBoundary } from "@/components/ui/error-boundary";
export type { ErrorBoundaryProps } from "@/components/ui/error-boundary";
export { Error } from "@/components/ui/error";
export { Feedback } from "@/components/ui/feedback";
export { JsonView, makeJsonViewHighlightPattern } from "@/components/ui/json-view";
export { Snippet } from "@/components/ui/snippet";

// Components — Navigation
export { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumbs";
export type { BreadcrumbType, BreadcrumbProps, BreadcrumbItemProps } from "@/components/ui/breadcrumbs";
export { Pagination } from "@/components/ui/pagination";
export type { PaginationProps, PaginationRailLink } from "@/components/ui/pagination";
export { Link } from "@/components/ui/link";
export type { LinkProps } from "@/components/ui/link";
export { SidebarNav } from "@/components/ui/sidebar-nav";
export type { SidebarNavProps, SidebarNavGroup, SidebarNavItem } from "@/components/ui/sidebar-nav";
export { Navbar } from "@/components/ui/navbar";
export type { NavbarProps } from "@/components/ui/navbar";
export { Footer } from "@/components/ui/footer";
export type { FooterProps, FooterColumn, FooterLink } from "@/components/ui/footer";
export { CommandMenu, CommandMenuInput, CommandMenuList, CommandMenuGroup, CommandMenuItem, CommandMenuDivider } from "@/components/ui/command-menu";
export { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from "@/components/ui/context-menu";
export { EditMenu } from "@/components/ui/edit-menu";
export type { EditMenuAction, EditMenuProps, EditMenuStandardAction } from "@/components/ui/edit-menu";
export { MenuContainer, MenuButton, Menu, MenuItem, MenuItemLocked, MenuLink, MenuDivider, MenuSection } from "@/components/ui/menu";
export { DotsMenu, DotsMenuItem, DotsMenuSeparator } from "@/components/ui/dots-menu";
export type { DotsMenuProps, DotsMenuItemProps, DotsMenuSeparatorProps } from "@/components/ui/dots-menu";
export { StepPoint } from "@/components/ui/step-point";

// Components — Overlay
export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
export type { SheetProps, SheetSide, SheetTriggerProps, SheetPortalProps, SheetOverlayProps, SheetHeaderProps, SheetTitleProps, SheetDescriptionProps, SheetFooterProps, SheetCloseProps, SheetContentProps } from "@/components/ui/sheet";
export { Drawer, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
export type { DrawerProps, DrawerTitleProps, DrawerDescriptionProps } from "@/components/ui/drawer";
export { Modal, ModalTrigger, ModalPortal, ModalOverlay, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter, ModalClose } from "@/components/ui/modal";
export { DestructiveActionModal } from "@/components/ui/destructive-action-modal";
export { ContextCard, ContextCardTrigger, ContextCardHeader, ContextCardTitle, ContextCardDescription, ContextCardAvatar, ContextCardBody, ContextCardFooter } from "@/components/ui/context-card";

// Components — Form
export { ClearableInput } from "@/components/ui/clearable-input";
export { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";
export { ChoiceboxGroup, ChoiceboxGroupItem } from "@/components/ui/choicebox";
export { SearchInput } from "@/components/ui/search-input";
export { Slider } from "@/components/ui/slider";
export type { SliderProps } from "@/components/ui/slider";
export { Textarea } from "@/components/ui/textarea";
export { Label } from "@/components/ui/label";
export { Fieldset, FieldsetTitle, FieldsetSubtitle, FieldsetContent, FieldsetFooter, FieldsetFooterStatus, FieldsetFooterActions, FieldsetFooterAction, ErrorText, WarningText, DisabledWall } from "@/components/ui/fieldset";

// Components — Layout
export { Grid, GridCell, GridCross, GridItem, GridPage, GridSystem } from "@/components/ui/grid";
export { Scroller } from "@/components/ui/scroller";
export type { ScrollerProps } from "@/components/ui/scroller";
export { ContinuousSurface } from "@/components/ui/continuous-surface";
export type { ContinuousSurfaceProps } from "@/components/ui/continuous-surface";

// Components — Mobile / Device
export { Device, DeviceScreen } from "@/components/ui/device";
export type { DeviceProps, DeviceScreenProps, PhoneStatusBarOptions, PhoneSafariOptions } from "@/components/ui/device";
export { Phone, PhoneScreen } from "@/components/ui/phone";
export { BottomSheet } from "@/components/ui/bottom-sheet";
export type { BottomSheetProps } from "@/components/ui/bottom-sheet";
export { HamburgerMenu } from "@/components/ui/hamburger-menu";
export type { HamburgerMenuProps, MenuItem as HamburgerMenuItem } from "@/components/ui/hamburger-menu";

// Components — Advanced
export { RelativeTimeCard } from "@/components/ui/relative-time-card";
export { FileTree, FileTreeItem, FileTreeLabel, FileTreeIcon } from "@/components/ui/file-tree";
export { KeyboardInput, Kbd } from "@/components/ui/keyboard-input";
export { Video } from "@/components/ui/video";
export { Browser } from "@/components/ui/browser";
export { Book } from "@/components/ui/book";
export { Gauge } from "@/components/ui/gauge";
export { RatingPill } from "@/components/ui/rating-pill";
export type { RatingPillProps, RatingValue } from "@/components/ui/rating-pill";
export { LoadMoreButton } from "@/components/ui/load-more-button";
export { ShowMore } from "@/components/ui/show-more";
export { TextWithCopyButton } from "@/components/ui/text-with-copy-button";
export { ProjectBanner, ProjectBannerContent, ProjectBannerClose } from "@/components/ui/project-banner";
export { SplitButton, SplitButtonMain, SplitButtonMenu, SplitButtonMenuItem } from "@/components/ui/split-button";
export { Note, NoteContent, NoteAction, NoteLabel } from "@/components/ui/note";
export { StatusDot } from "@/components/ui/status-dot";
export { Pill } from "@/components/ui/pill";
export { Banner } from "@/components/ui/banner";
export { MiddleTruncate } from "@/components/ui/middle-truncate";
export { MultiSelectRoot, MultiSelectTrigger, MultiSelectContent, MultiSelectRow } from "@/components/ui/multi-select";
export { ThemeSwitcher } from "@/components/ui/theme-switcher";
export type { MultiSelectRootProps, MultiSelectTriggerProps, MultiSelectContentProps, MultiSelectRowProps } from "@/components/ui/multi-select";
