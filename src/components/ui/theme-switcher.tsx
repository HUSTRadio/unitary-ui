import { Monitor, Moon, Smartphone, Sun } from "lucide-react";

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

export interface ThemeSwitcherProps {
  className?: string;
  small?: boolean;
  disabled?: boolean;
}

function ThemeSwitcher({ className, small = false, disabled = false }: ThemeSwitcherProps) {
  const { preference, setPreference } = useTheme();
  const { t } = useI18n();

  return (
    <div
      data-slot="theme-switcher"
      role="radiogroup"
      aria-label={t("Display theme")}
      aria-disabled={disabled || undefined}
      className={cn(
        "relative inline-flex items-center rounded-full bg-gray-alpha-200 p-0.5",
        className,
      )}
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
              // pointer-coarse：触屏命中区抬到 44×44（HIG-AUD-013）；桌面维持 24/32px 视觉。
              // 与 docs 壳层的 [&_button]:min-h-11 包装同语义（组件层原生支持后该包装可移除）
              "inline-flex items-center justify-center rounded-full text-muted-foreground outline-none focus-ring transition-colors motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-50 pointer-coarse:min-h-11 pointer-coarse:min-w-11",
              small ? "size-6" : "size-8",
              checked &&
                "bg-background text-foreground shadow-[0_0_0_1px_var(--gray-alpha-400),0_2px_2px_rgba(0,0,0,0.12)]",
            )}
          >
            {/* system 选项双图标：≥md 显示 Monitor，<md 显示 Smartphone。
                用 visibility 而非 display 切换——本 webview 下 display 工具类
                在 svg 上被 base 层 svg{display:block} 压制（层叠异常），visibility 无此问题 */}
            {value === "system" ? (
              <>
                <Monitor
                  className={cn(
                    small ? "size-3.5" : "size-4",
                    "max-md:absolute max-md:invisible md:visible",
                  )}
                  aria-hidden
                />
                <Smartphone
                  className={cn(
                    small ? "size-3.5" : "size-4",
                    "max-md:static md:absolute md:invisible",
                  )}
                  aria-hidden
                />
              </>
            ) : (
              <Icon className={small ? "size-3.5" : "size-4"} aria-hidden />
            )}
          </button>
        );
      })}
    </div>
  );
}

export { ThemeSwitcher };
