"use client";
import React, { useEffect, useState } from "react";
import Label from "./Label";

type Props = {
  className?: string;
  value?: Date;
  label?: string;
  subLabel?: string;
  setValue?: (val: Date) => void;
};

const DateTimePicker = (props: Props) => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (props.value) {
      setDate(props.value);
    } else {
      setDate(new Date());
    }
  }, []);

  const handleChange = (value: any) => {
    if (props.setValue) {
      props.setValue(value);
      setDate(new Date(value));
    }
  };

  return (
    <div className="truncate w-full">
      {props.label && props.label.length > 0 && (
        <div className="flex w-full justify-between items-center">
          <Label label={props.label} size="text-sm" className="pb-1" />
          {props.subLabel && props.subLabel.length > 0 && (
            <Label
              label={props.subLabel}
              size="text-xs"
              className="font-normal"
            />
          )}
        </div>
      )}
      <input
        type="date"
        placeholder="Select Date and Time"
        value={date.toISOString().split("T")[0]}
        onChange={(e) => handleChange(e.target.value)}
        className={`appearance-none truncate p-1 rounded w-full border border-interface-hover focus:outline-none focus:border-interface-secondry transition-all duration-500 selection:bg-interface-secondry/30 px-2 focus:drop-shadow-sm read-only:bg-interface-hover/20 ${
          props.className && props.className
        }`}
      />
    </div>
  );
};

export default DateTimePicker;
