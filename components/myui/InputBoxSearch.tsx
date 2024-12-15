"use client";
import { Search } from "lucide-react";
import React, { useEffect, useRef, forwardRef, useState } from "react";
import Label from "./Label";
import { ComboBoxOptions } from "./ComboBox";
import { product } from "@prisma/client";
import Image from "next/image";
import { formalizeText } from "@/lib/utils";

type Props = {
  label?: string;
  subLabel?: string;
  setValue?: any;
  setItem?: any;
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
    const [selected, setSelected] = useState<{
      id: string;
      index: number;
      max?: number;
    } | null>(null);

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

      if (e.key === "Enter") {
        if (selected) {
          if (props.setValue) {
            props.setValue(filteredProducts[selected.index].name);
          }

          if (props.setItem) {
            props.setItem(filteredProducts[selected.index]);
          }
          setHasProduct(false);
        }
      }

      if (props.onKeyDown) {
        props.onKeyDown(e);
      }

      if (e.key === "ArrowUp") {
        if (!selected) {
          setSelected({
            id: filteredProducts[0].id,
            index: 0,
          });
        } else {
          if (selected.index === 0) {
            setSelected((prev: any) => ({ ...prev, index: prev.max }));
          } else {
            setSelected((prev: any) => ({
              ...prev,
              id: filteredProducts[selected.index - 1].id,
              index: selected.index - 1,
            }));
          }
        }
      }

      if (e.key === "ArrowDown") {
        if (!selected) {
          setSelected({
            id: filteredProducts[0].id,
            index: 0,
          });
        } else {
          if (selected.index === filteredProducts.length - 1) {
            setSelected((prev: any) => ({ ...prev, index: 0 }));
          } else {
            setSelected((prev: any) => ({
              ...prev,
              id: filteredProducts[selected.index + 1].id,
              index: selected.index + 1,
            }));
          }
        }
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
        <SearchWindow
          options={filteredProducts}
          value={String(props.value)}
          toggle={hasProduct && String(props.value).length > 0}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
    );
  }
);

export default InputBoxSearch;

type SearchProps = {
  product: any;
  index: number;
  selected: { id: string; index: number; max?: number } | null;
};

type SearchWindowProps = {
  toggle: boolean;
  value: string;
  options: ComboBoxOptions[];
  selected: { id: string; index: number; max?: number } | null;
  setSelected: any;
};

const SearchWindow = (props: SearchWindowProps) => {
  let filteredOptions: any[] = [];

  useEffect(() => {
    if (filteredOptions.length === 0) {
      props.setSelected(null);
    } else {
      if (!props.selected) {
        props.setSelected({
          id: filteredOptions[0].id,
          index: 0,
          max: filteredOptions.length - 1,
        });
      }
    }
  }, [filteredOptions]);

  if (!props.toggle) {
    return null;
  }

  filteredOptions = props.options.filter((product: any) => {
    if (!props.value) {
      return true; // If no value is provided, include all products
    }

    const searchValue = String(props.value).toLowerCase();

    const matchesName = product.name.toLowerCase().includes(searchValue);
    const matchesBarcode = product.barcodeRegister.some((barcodeEntry: any) =>
      barcodeEntry.barcode.toLowerCase().includes(searchValue)
    );
    const matchesBrand = product.brand.name.toLowerCase().includes(searchValue);

    // Include the product if it matches name, barcode, or brand
    return matchesName || matchesBarcode || matchesBrand;
  });

  //distinct only
  filteredOptions = Array.from(new Set(filteredOptions));

  return (
    <div className="absolute w-full h-[400px] left-0 top-16 rounded z-50 bg-white shadow-lg border p-2">
      <div>
        <div className="mb-2">Results</div>
        <div>
          {filteredOptions.map((product: any, index: number) => (
            <div key={`${product.id} ${index}`}>
              <SearchRow
                product={product}
                index={index + 1}
                selected={props.selected}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SearchRow = (props: SearchProps) => {
  return (
    <div
      className={`${
        props.selected && props.selected.index === props.index - 1
          ? "bg-interface-hover/50"
          : "bg-white"
      } p-1 transition-all duration-200`}
    >
      <div>{/* <Image src={product.} /> */}</div>
      <div className="flex gap-2 items-center">
        <div className="opacity-50">{props.index}-</div>
        <div className="grid grid-cols-3 place-items-center w-full">
          <div className="font-semibold tracking-tight text-md">
            {props.product.name}
          </div>
          <div className="text-xs p-1 bg-interface-hover rounded">
            {props.product.barcodeRegister[0].barcode}
          </div>
          <div className="grid grid-cols-2 place-items-center w-full">
            <div
              className="w-2 h-2 rounded-full ml-auto"
              style={{
                backgroundColor: props.product.barcodeRegister[0].color,
              }}
            ></div>
            {formalizeText(props.product.barcodeRegister[0].color)}
          </div>
        </div>
      </div>
    </div>
  );
};
