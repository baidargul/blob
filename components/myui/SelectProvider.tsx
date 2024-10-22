import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { brand } from "@prisma/client";

type Props = {
  children: React.ReactNode;
  setValue?: (value: any) => void;
  selectedValue?: any;
  options?: any[];
  readonly?: boolean;
};

const SelectProvider = (props: Props) => {
  const handleSelect = (brand: brand) => {
    if (props.setValue) {
      props.setValue(brand);
    }
  };

  return (
    <Select onValueChange={(option: any) => handleSelect(option)}>
      <SelectTrigger
        className={`w-full rounded focus:border-interface-hover focus:ring-transparent focus:ring-offset-0 h-9 border border-interface-hover ${
          props.readonly && "bg-interface-hover/20"
        }`}
      >
        {props.selectedValue ? props.selectedValue.name : props.children}
      </SelectTrigger>
      {props.readonly !== true && (
        <SelectContent>
          {props.options &&
            props.options.map((option) => (
              <SelectItem key={option.id || option.name} value={option}>
                {option.name}
              </SelectItem>
            ))}
        </SelectContent>
      )}
    </Select>
  );
};

export default SelectProvider;
