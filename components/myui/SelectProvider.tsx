import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  children: React.ReactNode;
  options?: any[];
};

const SelectProvider = (props: Props) => {
  return (
    <Select>
      <SelectTrigger className="w-full rounded focus:border-none focus:ring-transparent focus:ring-offset-0 h-9 border border-interface-hover">
        {/* <SelectValue placeholder="Theme" /> */}
        {props.children}
      </SelectTrigger>
      {props.options && props.options?.length > 0 && (
        <SelectContent>
          {props.options &&
            props.options?.map((option) => (
              <SelectItem key={option} value={option}></SelectItem>
            ))}
        </SelectContent>
      )}
      {props.options && props.options?.length < 1 && (
        <SelectContent>
          <SelectItem value="No options">No option</SelectItem>
        </SelectContent>
      )}
    </Select>
  );
};

export default SelectProvider;
