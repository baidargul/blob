"use client";
import { Search } from "lucide-react";
import React, { useEffect, useRef, forwardRef, useState } from "react";
import Label from "./Label";
import { ComboBoxOptions } from "./ComboBox";
import { product } from "@prisma/client";
import Image from "next/image";

type Props = {
  label?: string;
  subLabel?: string;
  setValue?: any;
  value?: string | number;
  readonly?: boolean;
  icon?: any;
  type?: "number" | "text" | "email" | "password" | "url" | "date" | "time";
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  maxLength?: number;
  className?: string;
  options: ComboBoxOptions[];
};

const InputBoxSearch = forwardRef<HTMLInputElement, Props>(
  (props: Props, ref) => {
    const textRef = ref || useRef(null);
    const [hasProduct, setHasProduct] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState<product[]>([]);

    useEffect(() => {
      setFilteredProducts(props.options);
    }, [props.options]);

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (props.setValue) {
        props.setValue(e.target.value);
      }
      handleSearchProduct(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        setHasProduct(false);
        handleClearValue();
      }

      if (props.onKeyDown) {
        props.onKeyDown(e);
      }
    };

    const handleSearchProduct = (value: string) => {
      setHasProduct(true);
      for (const item of props.options) {
        if (item.name === value) {
          //   props.setValue(item);
          return;
        }
      }
    };

    const handleClearValue = () => {
      if (props.setValue) {
        props.setValue("");
        if (textRef && typeof textRef !== "function") {
          textRef.current?.select();
        }
      }
    };

    const handleFocus = () => {
      if (textRef && typeof textRef !== "function") {
        textRef.current?.select();
      }
    };

    return (
      <div className="relative">
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
        <div className="relative flex flex-col items-center justify-center">
          {props.icon && (
            <div className="absolute top-2 left-2">
              <props.icon className="w-4 h-4 text-interface-accent" />
            </div>
          )}
          <input
            ref={textRef}
            onChange={handleValueChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            value={props.value}
            readOnly={props.readonly}
            placeholder={props.placeholder ? props.placeholder : ""}
            type={props.type ? props.type : "text"}
            max={props.maxLength}
            maxLength={props.maxLength}
            className={`appearance-none truncate p-1 rounded w-full border border-interface-hover focus:outline-none focus:border-interface-secondry transition-all duration-500 selection:bg-interface-secondry/30 px-2 ${
              props.icon && "pl-7"
            } pr-7 focus:drop-shadow-sm read-only:bg-interface-hover/20 ${
              props.className && props.className
            }`}
          />
          {String(props.value).length > 0 && !props.readonly && (
            <div
              onClick={handleClearValue}
              className="absolute right-1 p-1 w-6 h-6 flex justify-center items-center text-center text-sm bg-interface-accent/80 rounded text-white cursor-pointer scale-[60%]"
            >
              x
            </div>
          )}
        </div>
        {hasProduct && (
          <div className="absolute w-full h-[400px] left-0 top-16 rounded z-50 bg-white shadow-lg border p-2">
            <div className="">
              <div className="mb-2">Results</div>
              <div>
                {filteredProducts.map((product: product, index: number) => {
                  if (props.value) {
                    if (
                      !product.name
                        .toLowerCase()
                        .includes(String(props.value).toLowerCase())
                    ) {
                      return null;
                    }
                  }

                  return (
                    <div key={product.id}>
                      <SearchRow product={product} index={index + 1} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default InputBoxSearch;

type SearchProps = {
  product: product;
  index: number;
};

const SearchRow = (props: SearchProps) => {
  return (
    <div className="border-y">
      <div>{/* <Image src={product.} /> */}</div>
      <div className="flex gap-2 items-center">
        <div className="opacity-50 ">{props.index}-</div>
        <div className="font-semibold tracking-tight text-lg">
          {props.product.name}
        </div>
      </div>
    </div>
  );
};
