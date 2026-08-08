import { Check, Monitor, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme, type ThemePreference } from "@/lib/theme";
import { cn } from "@/lib/utils";

/**
 * ThemeSwitch — 主题切换（图标 + 下拉三态）。
 *
 * 图标始终反映「当前生效主题」：浅色=Sun / 深色=Moon（跟随系统时显示实际解析结果）。
 * 点击打开 DropdownMenu，明确选择 浅色 / 深色 / 跟随系统，避免循环点击歧义。
 * Geist 原则：纯语义 token，无 dark: 变体。
 */

const OPTIONS: { value: ThemePreference; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "浅色", Icon: Sun },
  { value: "dark", label: "深色", Icon: Moon },
  { value: "system", label: "跟随系统", Icon: Monitor },
];

export function ThemeSwitch({ className }: { className?: string }) {
  const { preference, resolvedTheme, setPreference } = useTheme();
  const Icon = resolvedTheme === "dark" ? Moon : Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className={cn("text-muted-foreground hover:text-foreground", className)}
          aria-label="切换主题"
          title="切换主题"
        >
          <Icon className="size-4" strokeWidth={1.5} aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {OPTIONS.map((option) => {
          const OptionIcon = option.Icon;
          const active = preference === option.value;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setPreference(option.value)}
              aria-checked={active}
              className={cn(
                "gap-2",
                active && "text-foreground",
                !active && "text-muted-foreground",
              )}
            >
              <OptionIcon className="size-4" strokeWidth={1.5} aria-hidden />
              <span className="flex-1">{option.label}</span>
              {active && <Check className="size-3.5" strokeWidth={2} aria-hidden />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
