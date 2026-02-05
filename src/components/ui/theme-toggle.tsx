import * as React from "react";
import { Sun, Moon, Monitor } from "lucide-react";

import { cn } from "../../lib/utils";

export type ThemeValue = "light" | "dark" | "system";

export interface ThemeToggleOption {
  value: ThemeValue;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const DEFAULT_OPTIONS: ThemeToggleOption[] = [
  { value: "light", icon: Sun, label: "浅色" },
  { value: "dark", icon: Moon, label: "深色" },
  { value: "system", icon: Monitor, label: "跟随系统" },
];

export interface ThemeToggleProps {
  /** 当前主题 */
  value: ThemeValue;
  /** 主题变更回调 */
  onValueChange: (value: ThemeValue) => void;
  /** 可选配置（图标与文案），默认浅色/深色/跟随系统 */
  options?: ThemeToggleOption[];
  className?: string;
}

function ThemeToggle({
  value,
  onValueChange,
  options = DEFAULT_OPTIONS,
  className,
}: ThemeToggleProps) {
  return (
    <div
      className={cn(
        "bg-muted inline-flex gap-1 rounded-lg p-1",
        className
      )}
      role="group"
      aria-label="主题切换"
    >
      {options.map((option) => {
        const Icon = option.icon;
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onValueChange(option.value)}
            title={option.label}
            aria-pressed={isSelected}
            aria-label={option.label}
            className={cn(
              "flex size-8 items-center justify-center rounded-md transition-colors",
              isSelected
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
          </button>
        );
      })}
    </div>
  );
}

export { ThemeToggle };
