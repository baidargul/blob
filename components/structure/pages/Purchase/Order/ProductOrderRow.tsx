import Button from "@/components/myui/Button";
import DialogProvider from "@/components/myui/DialogProvider";
import InputBox from "@/components/myui/InputBox";
import React, { useEffect, useState } from "react";

type Props = {
  item: any;
  index: number;
  updateProducts: (
    item: any,
    command: "update" | "updateAll" | "remove" | "removeAll",
    color?: string,
    cost?: number,
    invoice?: number
  ) => void;
};

const ProductOrderRow = (props: Props) => {
  return (
    <DialogProvider
      content={
        <ProductEditor
          item={{ ...props.item }}
          updateProducts={props.updateProducts}
        />
      }
      title="Edit Product"
    >
      <div className="p-2 bg-white min-w-fit lg:w-full rounded flex gap-1 lg:items-start border border-transparent hover:bg-interface-secondry/30 hover:border-interface-secondry transition-all duration-200 cursor-pointer">
        <div className="font-bold text-interface-text/30">
          {props.index + 1}-
        </div>
        <div className="flex flex-col items-center lg:items-stretch gap-1 min-w-fit w-full">
          <div className="font-semibold tracking-tight text-interface-text/80 text-sm flex justify-between items-center">
            <div className="text-base">
              {props.item.name}
              {` [${String(props.item.brand.name).toLocaleUpperCase()}]`}
            </div>
            <div className="text-xs tracking-widest hidden lg:block">
              <div>
                <div>
                  {props.item.category.name}/{props.item.type.name}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs tracking-widest  lg:text-left lg:flex lg:justify-between lg:items-end">
              <div className="flex gap-1 items-center">
                <div className="flex gap-1 items-center">
                  <div className="font-semibold">Cost:</div>{" "}
                  {props.item.barcodeRegister[0].cost}
                </div>
                <div className="flex gap-1 items-center">
                  <div className="font-semibold">Invoice:</div>{" "}
                  {props.item.barcodeRegister[0].invoice}
                </div>
              </div>
              <div className="border-b text-center lg:text-start">
                {props.item.barcodeRegister[0].barcode}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DialogProvider>
  );
};

export default ProductOrderRow;

type ProductEditorProps = {
  item: any;
  updateProducts: (
    item: any,
    command: "update" | "updateAll" | "remove" | "removeAll",
    color?: string,
    cost?: number,
    invoice?: number
  ) => void;
};

function ProductEditor(props: ProductEditorProps) {
  const [barcode, setBarcode] = useState("");
  const [color, setColor] = useState("");
  const [cost, setCost] = useState(0);
  const [invoice, setInvoice] = useState(0);

  useEffect(() => {
    setBarcode(props.item.barcodeRegister[0].barcode);
    setColor(props.item.barcodeRegister[0].color);
    setCost(props.item.barcodeRegister[0].cost);
    setInvoice(props.item.barcodeRegister[0].invoice);
  }, [props.item]);

  const handleBarcodeChange = (value: string) => {
    setBarcode(value);
  };

  const handleColorChange = (value: string) => {
    setColor(value);
  };

  const handleCostChange = (value: number) => {
    setCost(value);
  };

  const handleInvoiceChange = (value: number) => {
    setInvoice(value);
  };

  const handleBarcodeKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey && e.key === " ") {
      let temp: any = Math.random();
      temp = temp.toString(16);
      temp = `${temp.slice(2, 10)}${Math.random().toFixed(
        0
      )}${new Date().getMinutes()}${new Date().getSeconds()}${new Date().getMilliseconds()}${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDate()}`;
      //Get first 15 characters
      temp = temp.slice(0, 15);
      setBarcode(String(temp).toLocaleUpperCase());
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xl text-interface-text font-bold">
        {props.item.name}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <InputBox
          label="Barcode"
          value={barcode}
          setValue={handleBarcodeChange}
          onKeyDown={handleBarcodeKeyPress}
          placeholder="Press Ctrl+Space to generate barcode"
        />
        <InputBox label="Color" value={color} setValue={handleColorChange} />
        <InputBox
          label="Invoice"
          value={invoice}
          setValue={handleInvoiceChange}
        />
        <InputBox label="Cost" value={cost} setValue={handleCostChange} />
      </div>
      <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-2">
        <Button
          onClick={() =>
            props.updateProducts(props.item, "update", color, cost, invoice)
          }
          className="text-sm text-center sm:text-start"
        >
          Update
        </Button>
        <Button
          onClick={() =>
            props.updateProducts(props.item, "updateAll", color, cost, invoice)
          }
          className="text-sm text-center sm:text-start"
        >
          Update all
        </Button>
        <Button
          onClick={() => props.updateProducts(props.item, "remove")}
          className="text-sm text-center sm:text-start"
        >
          Remove
        </Button>
        <Button
          onClick={() => props.updateProducts(props.item, "removeAll")}
          className="text-sm text-center sm:text-start"
        >
          Remove all
        </Button>
      </div>
    </div>
  );
}
