"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
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
import Label from "./Label";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

export type ComboBoxOptions =
  | {
      value: string;
      label: string;
    }
  | any;

type Props = {
  options?: ComboBoxOptions[];
  setValue?: (value: ComboBoxOptions) => void;
  placeholder?: string;
  label?: string;
  value?: string | null;
  disabled?: boolean;
};

export const ComboBox_ADD_VALUE_TO_EACH_OPTION = (
  options: ComboBoxOptions[]
) => {
  return options.map((option) => {
    return {
      ...option,
      value: option.name,
      label: option.name,
    };
  });
};

export function Combobox(props: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    if (props.value) {
      if (props.value.length > 0) {
        setValue(props.value);
      }
    } else {
      setValue("");
    }
  }, [props.value]);

  const handleValueChange = (value: ComboBoxOptions) => {
    setValue(value.value);
    if (props.setValue) {
      props.setValue(value);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        className={`w-full focus:border-transparent outline-transparent ring-transparent ${
          props.disabled && "pointer-events-none opacity-50"
        }`}
        disabled={props.disabled ? props.disabled : false}
      >
        <div>
          {props.label && props.label.length > 0 && (
            <Label label={props.label} size="text-sm" className="pb-1" />
          )}
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full hover:bg-white px-2 h-[2.2rem] justify-between focus:border-transparent outline-transparent ring-transparent"
          >
            {value
              ? props.options &&
                props.options.find((framework) => framework.value === value)
                  ?.label
              : "Select option"}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height]">
        <Command className="w-full">
          <CommandInput
            placeholder={
              props.placeholder ? props.placeholder : "Search option"
            }
            className="w-full h-9"
          />
          <CommandList className="w-full">
            <CommandEmpty>Nothing found.</CommandEmpty>
            <CommandGroup className="w-full">
              {props.options &&
                props.options.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={(currentValue) => {
                      handleValueChange(framework);
                    }}
                    className="w-full"
                  >
                    {framework.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === framework.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
