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
  defaultItem?: (item: any) => void;
  value?: string;
  readonly?: boolean;
  icon?: React.ComponentType | any;
  type?: "number" | "text" | "email" | "password" | "url" | "date" | "time";
  placeholder?: string;
  options: ComboBoxOptions[];
  disabled?: boolean;
  filterRow: (
    option: any,
    index: number,
    selectedIndex: number | null,
    setValue: any,
    setItem: any,
    setFilteredOptions: any
  ) => any;
  filterFunction: (value: string, product: product) => boolean;
};

const InputBoxSearch = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const inputRef: any = ref || useRef<HTMLInputElement>(null);
  const [filteredOptions, setFilteredOptions] = useState<ComboBoxOptions[]>(
    props.options
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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
      props.filterFunction(value, option)
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
      if (selectedItem) {
        props.setValue?.(selectedItem?.name);
        props.setItem?.(selectedItem);
      }
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
          value={props.defaultItem ? props.defaultItem.name : props.value || ""}
          setValue={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={props.placeholder}
          readonly={props.readonly}
          className={`w-full border p-2 rounded ${props.icon ? "pl-8" : ""}`}
          disabled={props.disabled}
        />
      </div>
      {filteredOptions.length > 0 &&
        props.value &&
        props.value?.length > 0 &&
        !props.disabled && (
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

/* SAMPLE ROW CODE */

// const productSearchFilterRow = (
//   option: any,
//   index: number,
//   selectedIndex: number | null,
// ) => {
//   return (
//     <li
//       className={`p-2 cursor-pointer ${
//         index === selectedIndex ? "bg-interface-primary/20" : ""
//       }`}
//     >
//       <div className="flex gap-2 items-center">
//         <div className="opacity-50">{index + 1}-</div>
//         <div className="grid grid-cols-3 place-items-center w-full">
//           <div className="font-semibold tracking-tight text-md">
//             {option.name}
//           </div>
//           <div className="text-xs p-1 bg-interface-hover border border-b-white rounded">
//             {option.barcodeRegister[0].barcode}
//           </div>
//           <div className="grid grid-cols-2 place-items-center w-full">
//             <div
//               className="w-2 h-2 rounded-full ml-auto"
//               style={{
//                 backgroundColor: option.barcodeRegister[0].color,
//               }}
//             ></div>
//             {formalizeText(option.barcodeRegister[0].color)}
//           </div>
//         </div>
//       </div>
//     </li>
//   );
// };
