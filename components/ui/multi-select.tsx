"use client";

import * as React from "react";
import { useCallback, useMemo, useState } from "react";
import { ChevronsUpDown, Plus, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  value: string;
  label: string;
  meta?: string;
  group?: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  emptyPlaceholder?: string;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options",
  emptyPlaceholder = "No items found.",
  searchPlaceholder = "Search options…",
  className,
  disabled,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const groups = useMemo(() => {
    const grouped = options.reduce<Record<string, MultiSelectOption[]>>(
      (acc, option) => {
        const key = option.group ?? "_default";
        acc[key] = acc[key] ? [...acc[key], option] : [option];
        return acc;
      },
      {},
    );
    return Object.entries(grouped);
  }, [options]);

  const selectedOptions = useMemo(
    () => options.filter((option) => value.includes(option.value)),
    [options, value],
  );

  const toggleValue = useCallback(
    (identifier: string) => {
      const exists = value.includes(identifier);
      if (exists) {
        onChange(value.filter((item) => item !== identifier));
      } else {
        onChange([...value, identifier]);
      }
    },
    [onChange, value],
  );

  const removeValue = useCallback(
    (identifier: string) => {
      onChange(value.filter((item) => item !== identifier));
    },
    [onChange, value],
  );

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={(next) => !disabled && setOpen(next)}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between rounded-lg border-zinc-800 bg-zinc-950 text-left text-sm text-zinc-200 hover:bg-zinc-900/60",
              selectedOptions.length === 0 && "text-zinc-500",
            )}
          >
            <span className="flex items-center gap-2">
              <Plus className="size-4" />
              {selectedOptions.length > 0
                ? `${selectedOptions.length} selected`
                : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 size-4 opacity-70" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] rounded-lg border-zinc-800 bg-zinc-950 p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyPlaceholder}</CommandEmpty>
              {groups.map(([groupName, items]) => (
                <CommandGroup
                  key={groupName}
                  heading={
                    groupName !== "_default" ? (
                      <span className="text-xs uppercase tracking-wide text-zinc-500">
                        {groupName}
                      </span>
                    ) : undefined
                  }
                >
                  {items.map((option) => {
                    const isSelected = value.includes(option.value);
                    return (
                      <CommandItem
                        key={option.value}
                        onSelect={() => toggleValue(option.value)}
                        className="flex items-center justify-between rounded-md px-2 py-2 text-sm text-zinc-200 data-[selected=true]:bg-zinc-800/70"
                        data-selected={isSelected}
                      >
                        <span>
                          {option.label}
                          {option.meta ? (
                            <span className="ml-2 text-xs text-zinc-500">
                              {option.meta}
                            </span>
                          ) : null}
                        </span>
                        {isSelected ? (
                          <span className="text-xs text-zinc-400">Selected</span>
                        ) : null}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedOptions.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <Badge
              key={option.value}
              variant="outline"
              className="flex items-center gap-1 rounded-full border-zinc-800 bg-zinc-900/70 text-xs text-zinc-200"
            >
              {option.label}
              <button
                type="button"
                className="rounded-full p-1 transition hover:bg-zinc-800"
                onClick={() => removeValue(option.value)}
                aria-label={`Remove ${option.label}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  );
}
