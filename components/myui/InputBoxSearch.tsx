"use client";

import { Search } from "lucide-react";
import React, { useEffect, useRef, forwardRef, useState } from "react";
import Label from "./Label";
import { ComboBoxOptions } from "./ComboBox";
import { product } from "@prisma/client";
import { formalizeText } from "@/lib/utils";
import InputBox from "./InputBox";

// Type Definitions
type Props = {
  label?: string;
  setValue?: (value: string) => void;
  setItem?: (item: ComboBoxOptions) => void;
  value?: string;
  readonly?: boolean;
  icon?: React.ComponentType | any;
  type?: "number" | "text" | "email" | "password" | "url" | "date" | "time";
  placeholder?: string;
  options: ComboBoxOptions[];
  filterRow: (
    option: any,
    index: number,
    selectedIndex: number | null,
    setValue: any,
    setItem: any,
    setFilteredOptions: any
  ) => any;
};

const InputBoxSearch = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const inputRef: any = ref || useRef<HTMLInputElement>(null);
  const [filteredOptions, setFilteredOptions] = useState<ComboBoxOptions[]>(
    props.options
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const isTargetProduct = (targetText: string, product: any) => {
    const normalizedTarget = targetText.toLowerCase();

    return (
      product.name.toLowerCase().includes(normalizedTarget) ||
      product.type.name.toLowerCase().includes(normalizedTarget) ||
      product.brand.name.toLowerCase().includes(normalizedTarget) ||
      product.brand.description?.toLowerCase().includes(normalizedTarget) ||
      product.barcodeRegister.some((barcodeEntry: any) =>
        barcodeEntry.barcode.toLowerCase().includes(normalizedTarget)
      ) ||
      product.barcodeRegister.some((barcodeEntry: any) =>
        barcodeEntry.color.toLowerCase().includes(normalizedTarget)
      ) ||
      product.category.name.toLowerCase().includes(normalizedTarget) ||
      product.category.description?.toLowerCase().includes(normalizedTarget) ||
      product.price.toString().toLowerCase().includes(normalizedTarget) ||
      product.cost.toString().toLowerCase().includes(normalizedTarget)
    );
  };

  useEffect(() => {
    setFilteredOptions(props.options);
  }, [props.options]);

  const handleInputChange = (value: string) => {
    props.setValue?.(value);

    if (value.trim() === "") {
      setFilteredOptions(props.options);
      return;
    }

    const filtered = props.options.filter((option) =>
      isTargetProduct(value, option)
    );

    setFilteredOptions(filtered);
    setSelectedIndex(filtered.length > 0 ? 0 : null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();

      if (!filteredOptions.length) return;

      setSelectedIndex((prevIndex) => {
        if (prevIndex === null) return 0;
        const nextIndex = e.key === "ArrowUp" ? prevIndex - 1 : prevIndex + 1;
        return (nextIndex + filteredOptions.length) % filteredOptions.length;
      });
    } else if (e.key === "Enter" && selectedIndex !== null) {
      const selectedItem = filteredOptions[selectedIndex];
      props.setValue?.(selectedItem.name);
      props.setItem?.(selectedItem);
      setFilteredOptions([]); // Close the dropdown
    } else if (e.key === "Escape") {
      setFilteredOptions([]); // Close the dropdown
    }
  };

  return (
    <div className="relative">
      {props.label && (
        <Label label={props.label} size="text-sm" className="pb-1" />
      )}
      <div className="relative">
        {props.icon && <props.icon className="absolute top-2 left-2 w-4 h-4" />}
        <InputBox
          ref={inputRef}
          type={props.type || "text"}
          value={props.value || ""}
          setValue={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={props.placeholder}
          readonly={props.readonly}
          className={`w-full border p-2 rounded ${props.icon ? "pl-8" : ""}`}
        />
      </div>
      {filteredOptions.length > 0 && props.value && props.value?.length > 0 && (
        <ul className="absolute w-full bg-white border mt-1 max-h-60 overflow-auto z-10">
          {filteredOptions.map((option, index) => (
            <li
              key={`${option.id}-${index}`}
              onClick={() => {
                props.setValue?.(option.name);
                props.setItem?.(option);
                setFilteredOptions([]); // Close the dropdown
              }}
              className={`cursor-pointer ${
                index === selectedIndex ? "bg-interface-primary/5" : ""
              }`}
            >
              {props.filterRow(
                option,
                index,
                selectedIndex,
                props.setValue,
                props.setItem,
                setFilteredOptions
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default InputBoxSearch;

export type filterRowType = {
  option: any;
  index: number;
  selectedIndex: number | null;
  setValue: any;
  setItem: any;
  setFilteredOptions: any;
};
