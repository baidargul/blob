"use client";
import { Search } from "lucide-react";
import React, { useRef } from "react";
import Label from "./Label";

type Props = {
  label?: string;
  setValue?: any;
  value?: string;
  readonly?: boolean;
  icon?: any;
};

const InputBox = (props: Props) => {
  const textRef: any = useRef(null);
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.setValue) {
      props.setValue(e.target.value);
    }
  };

  const handleClearValue = () => {
    if (props.setValue) {
      props.setValue("");
      if (textRef.current) {
        textRef.current.select();
      }
    }
  };

  return (
    <div>
      {props.label && props.label.length > 0 && (
        <Label label={props.label} size="text-sm" />
      )}
      <div className="relative">
        {props.icon && (
          <div className="absolute top-2 left-2">
            <props.icon className="w-4 h-4 text-interface-accent" />
          </div>
        )}
        <input
          ref={textRef}
          onChange={handleValueChange}
          value={props.value}
          readOnly={props.readonly}
          className={`appearance-none p-1 rounded w-full border border-interface-hover focus:outline-none focus:border-interface-secondry transition-all duration-500 selection:bg-interface-secondry/30 px-2 ${
            props.icon && "pl-7"
          }  pr-7 focus:drop-shadow-sm read-only:bg-interface-hover`}
        />
        {props.value && props.value.length > 0 && !props.readonly && (
          <div
            onClick={handleClearValue}
            className="absolute top-1 right-1 p-1 w-6 h-6 flex justify-center items-center text-center text-sm bg-interface-accent/80 rounded text-white cursor-pointer scale-[60%]"
          >
            x
          </div>
        )}
      </div>
    </div>
  );
};

export default InputBox;
