import * as React from "react";
import { Command } from "cmdk";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

const CommandMenuContext = React.createContext<{
  close: () => void;
  query: string;
  setQuery: (value: string) => void;
} | null>(null);

function useCommandMenu() {
  const context = React.useContext(CommandMenuContext);
  if (!context) throw new Error("CommandMenu components must be used inside CommandMenu");
  return context;
}

type CommandMenuProps = {
  children?: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
};

type CommandMenuInputProps = React.ComponentPropsWithoutRef<typeof Command.Input>;
type CommandMenuListProps = React.ComponentPropsWithoutRef<typeof Command.List>;
type CommandMenuGroupProps = React.ComponentPropsWithoutRef<typeof Command.Group>;
type CommandMenuDividerProps = React.ComponentPropsWithoutRef<typeof Command.Separator>;

function CommandMenu({ children, open, setOpen }: CommandMenuProps) {
  const { t } = useI18n();
  const [query, setQuery] = React.useState("");
  const titleId = React.useId();
  const descriptionId = React.useId();
  const close = React.useCallback(() => setOpen(false), [setOpen]);

  React.useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          data-slot="command-menu-overlay"
          className="command-menu-overlay fixed inset-0 z-100 bg-background-100 opacity-80"
        />
        <DialogPrimitive.Content
          data-slot="command-menu-content"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            requestAnimationFrame(() => document.body.focus());
          }}
          className="command-menu-scale command-menu-mobile fixed top-[15%] left-1/2 z-100 w-[640px] -translate-x-1/2 overflow-hidden rounded-overlay bg-background-100 outline-none max-grid-sm:top-auto max-grid-sm:bottom-0 max-grid-sm:left-0 max-grid-sm:h-[80vh] max-grid-sm:max-h-[80vh] max-grid-sm:w-full max-grid-sm:max-w-full max-grid-sm:translate-x-0 max-grid-sm:overflow-auto max-grid-sm:rounded-t-overlay max-grid-sm:rounded-b-none"
        >
          <h2 id={titleId} className="sr-only">
            {t("Command Menu")}
          </h2>
          <p id={descriptionId} className="sr-only">
            {t("Use the command menu to navigate through available actions.")}
          </p>
          <CommandMenuContext.Provider value={{ close, query, setQuery }}>
            <Command
              data-testid="cmdk/root"
              label={t("Command Menu")}
              loop
              className="w-full bg-background-100 text-foreground"
            >
              {children}
            </Command>
          </CommandMenuContext.Provider>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

const CommandMenuInput = React.forwardRef<
  React.ElementRef<typeof Command.Input>,
  CommandMenuInputProps
>(({ className, ...props }, ref) => {
  const { close, query, setQuery } = useCommandMenu();
  const { t } = useI18n();
  return (
    <div className="relative flex w-full items-center gap-2 border-b border-gray-alpha-400 px-4 py-3">
      <Command.Input
        ref={ref}
        value={query}
        onValueChange={setQuery}
        className={cn(
          "h-7 flex-1 border-none bg-transparent text-base text-[var(--ds-gray-1000)] outline-hidden placeholder:text-[var(--ds-gray-700)] sm:text-lg",
          className,
        )}
        {...props}
      />
      <button
        type="button"
        aria-label={t("Close command menu")}
        onClick={close}
        className="ml-auto hidden h-5 cursor-pointer items-center rounded-overlay-item border-none bg-background-100 px-1 py-0 text-xs text-gray-1000 shadow-[var(--material-shadow-base)] outline-none transition-[background] duration-(--uni-duration-base) [@media(hover:hover)_and_(pointer:fine)]:flex focus-visible:shadow-[var(--focus-ring-outline)] hover:bg-gray-100"
      >
        Esc
      </button>
    </div>
  );
});
CommandMenuInput.displayName = "CommandMenuInput";

const CommandMenuList = React.forwardRef<
  React.ElementRef<typeof Command.List>,
  CommandMenuListProps
>(({ className, children, ...props }, ref) => {
  const { query } = useCommandMenu();
  const { t } = useI18n();
  return (
    <Command.List
      ref={ref}
      label={t("Suggestions")}
      className={cn(
        "flex max-h-none overflow-y-auto p-2 transition-[height] duration-(--uni-duration-fast) sm:block sm:max-h-[436px]",
        className,
      )}
      {...props}
    >
      <Command.Empty
        role="presentation"
        className="px-0 py-[30px] text-left text-copy-16 text-foreground"
      >
        {t('No results found for "{query}".', { query })}
      </Command.Empty>
      {children}
    </Command.List>
  );
});
CommandMenuList.displayName = "CommandMenuList";

type CommandMenuItemProps = React.ComponentPropsWithoutRef<typeof Command.Item> & {
  suffix?: React.ReactNode;
  callback?: () => void;
};

const CommandMenuItem = React.forwardRef<
  React.ElementRef<typeof Command.Item>,
  CommandMenuItemProps
>(({ className, suffix, callback, onSelect, children, ...props }, ref) => {
  const { close } = useCommandMenu();
  return (
    <Command.Item
      ref={ref}
      onSelect={(value) => {
        callback?.();
        onSelect?.(value);
        close();
      }}
      className={cn(
        "flex min-h-10 w-full cursor-pointer items-center gap-3 rounded-overlay-item px-2 py-0 text-copy-14 text-foreground outline-none sm:min-h-9",
        "data-[selected=true]:bg-gray-alpha-100 [@media(hover:hover)_and_(pointer:fine)]:data-[selected=true]:bg-gray-alpha-100",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      {suffix ? <div className="ml-auto flex items-stretch gap-1">{suffix}</div> : null}
    </Command.Item>
  );
});
CommandMenuItem.displayName = "CommandMenuItem";

const CommandMenuGroup = React.forwardRef<
  React.ElementRef<typeof Command.Group>,
  CommandMenuGroupProps
>(({ className, ...props }, ref) => (
  <Command.Group
    ref={ref}
    className={cn(
      "[&_[cmdk-group-heading]]:flex [&_[cmdk-group-heading]]:h-9 [&_[cmdk-group-heading]]:items-center [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:text-[13px] [&_[cmdk-group-heading]]:leading-[1.5] [&_[cmdk-group-heading]]:text-[var(--ds-gray-900)]",
      className,
    )}
    {...props}
  />
));
CommandMenuGroup.displayName = "CommandMenuGroup";

const CommandMenuDivider = React.forwardRef<
  React.ElementRef<typeof Command.Separator>,
  CommandMenuDividerProps
>(({ className, ...props }, ref) => (
  <Command.Separator
    ref={ref}
    className={cn("my-2 -ml-2 h-px w-[calc(100%+16px)] bg-[var(--ds-gray-alpha-400)]", className)}
    {...props}
  />
));
CommandMenuDivider.displayName = "CommandMenuDivider";

export {
  CommandMenu,
  CommandMenuDivider,
  CommandMenuGroup,
  CommandMenuInput,
  CommandMenuItem,
  CommandMenuList,
};
export type {
  CommandMenuProps,
  CommandMenuInputProps,
  CommandMenuListProps,
  CommandMenuItemProps,
  CommandMenuGroupProps,
  CommandMenuDividerProps,
};
