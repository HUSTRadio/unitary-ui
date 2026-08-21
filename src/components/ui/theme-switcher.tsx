import { Monitor, Moon, Sun } from "lucide-react";

import { useTheme, type ThemePreference } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

const THEME_OPTIONS: Array<{
  value: ThemePreference;
  label: string;
  icon: typeof Sun;
}> = [
  { value: "light", label: "Light", icon: Sun },
  { value: "system", label: "System", icon: Monitor },
  { value: "dark", label: "Dark", icon: Moon },
];

function ThemeSwitcher({
  className,
  small = false,
  disabled = false,
}: {
  className?: string;
  small?: boolean;
  disabled?: boolean;
}) {
  const { preference, setPreference } = useTheme();
  const { t } = useI18n();

  return (
    <div
      data-slot="theme-switcher"
      role="radiogroup"
      aria-label={t("Display theme")}
      aria-disabled={disabled || undefined}
      className={cn("inline-flex items-center rounded-full bg-gray-alpha-200 p-0.5", className)}
    >
      {THEME_OPTIONS.map(({ value, label, icon: Icon }) => {
        const localizedLabel = t(label);
        const checked = preference === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={localizedLabel}
            title={localizedLabel}
            disabled={disabled}
            onClick={() => setPreference(value)}
            className={cn(
              "inline-flex items-center justify-center rounded-full text-muted-foreground outline-none transition-colors disabled:pointer-events-none disabled:opacity-50",
              small ? "size-6" : "size-8",
              checked &&
                "bg-background text-foreground shadow-[0_0_0_1px_var(--gray-alpha-400),0_2px_2px_rgba(0,0,0,0.12)]",
            )}
          >
            <Icon className={small ? "size-3.5" : "size-4"} aria-hidden />
          </button>
        );
      })}
    </div>
  );
}

export { ThemeSwitcher };
