import Button from "@/components/myui/Button";
import DialogProvider from "@/components/myui/DialogProvider";
import InputBox from "@/components/myui/InputBox";
import { ColorWheelIcon } from "@radix-ui/react-icons";
import {
  Barcode,
  Palette,
  Receipt,
  ReceiptCent,
  Save,
  StickyNote,
  Trash,
} from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {
  item: any;
  index: number;
  updateProducts: (
    item: any,
    command: "update" | "updateAll" | "remove" | "removeAll",
    barcode: string,
    color?: string,
    cost?: number,
    invoice?: number,
    setWait?: any
  ) => void;
};

const ProductOrderRow = (props: Props) => {
  return (
    <DialogProvider
      content={
        <ProductEditor
          item={{ ...props.item }}
          index={props.index}
          updateProducts={props.updateProducts}
        />
      }
      title="Edit Product"
    >
      <div className="p-2 bg-white min-w-[260px] lg:w-full rounded flex gap-1 lg:items-start border border-transparent hover:bg-interface-secondry/30 hover:border-interface-secondry transition-all duration-200 cursor-pointer">
        <div className="font-bold text-interface-text/30">{props.index}-</div>
        <div className="flex flex-col items-start lg:items-stretch gap-1 min-w-fit w-full">
          <div className="font-semibold tracking-tight text-interface-text/80 text-sm flex justify-between items-center">
            <div className="text-base transition-all duration-500 tracking-widest lg:tracking-normal flex lg:flex-row flex-row-reverse items-center gap-1">
              {props.item.name}
              <span className="text-xs -ml-1 lg:ml-0 p-1 bg-interface-secondry/30 lg:rounded-md scale-90 lg:px-2">
                {` ${String(props.item.brand.name).toLocaleUpperCase()}`}
              </span>
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
            <div className="-mt-2 lg:hidden">
              <div className="opacity-60 font-mono transition-all duration-1000 delay-1000 p-0 m-0 text-start tracking-widest text-sm">
                {props.item.category.name}/{props.item.type.name}
              </div>
            </div>
            <div className="text-xs tracking-widest  lg:text-left lg:flex lg:justify-between lg:items-end">
              <div className="flex flex-wrap transition-all duration-800 mb-1 lg:mb-0 justify-items-start">
                <div className="flex gap-1 items-center">
                  <ReceiptCent className="w-4 h-4" />
                  <div className="font-semibold hidden lg:block">Cost:</div>
                  {props.item.barcodeRegister[0].cost},
                </div>
                <div className="flex gap-1 items-center">
                  <Receipt className="w-4 h-4" />
                  <div className="font-semibold hidden lg:block">Invoice:</div>
                  {props.item.barcodeRegister[0].invoice},
                </div>
                {String(props.item.barcodeRegister[0].color).length > -1 && (
                  <div className="flex gap-1 items-center">
                    <Palette className="w-4 h-4" />
                    <div className="font-semibold hidden lg:block">Color:</div>
                    {props.item.barcodeRegister[0].color},
                  </div>
                )}
              </div>
              <div className="text-center flex gap-1 items-center lg:text-start">
                <Barcode className="w-4 h-4" />
                <div className="font-semibold hidden lg:block">Barcode:</div>
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
  index?: number;
  updateProducts: (
    item: any,
    command: "update" | "updateAll" | "remove" | "removeAll",
    barcode: string,
    color?: string,
    cost?: number,
    invoice?: number,
    setWait?: any
  ) => void;
};

function ProductEditor(props: ProductEditorProps) {
  const [barcode, setBarcode] = useState("");
  const [color, setColor] = useState("");
  const [cost, setCost] = useState(0);
  const [invoice, setInvoice] = useState(0);
  const [isWorking, setIsWorking] = useState(false);

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

  const executeUpdateFunction = async (
    command: "update" | "updateAll" | "remove" | "removeAll"
  ) => {
    await props.updateProducts(
      props.item,
      command,
      barcode,
      color,
      cost,
      invoice,
      setIsWorking
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xl text-interface-text font-bold flex gap-1 items-center">
        {props.index && (
          <span className="text-interface-text/40">{props.index}-</span>
        )}
        {props.item.name}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <InputBox
          label="Barcode"
          value={barcode}
          setValue={handleBarcodeChange}
          onKeyDown={handleBarcodeKeyPress}
          placeholder="Press Ctrl+Space to generate barcode"
          maxLength={15}
          readonly={isWorking}
        />
        <InputBox
          label="Color"
          value={color}
          setValue={handleColorChange}
          readonly={isWorking}
        />
        <InputBox
          label="Invoice"
          value={invoice}
          setValue={handleInvoiceChange}
          readonly={isWorking}
        />
        <InputBox
          label="Cost"
          value={cost}
          setValue={handleCostChange}
          readonly={isWorking}
        />
      </div>
      <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-2 gap-2">
        <Button
          disabled={isWorking}
          onClick={() => executeUpdateFunction("update")}
          className="text-sm text-center sm:text-start flex gap-1 items-center justify-center sm:justify-normal"
        >
          <Save className="w-4 h-4" />
          Update
        </Button>
        <Button
          disabled={isWorking}
          onClick={() => executeUpdateFunction("updateAll")}
          className="text-sm text-center sm:text-start flex gap-1 items-center justify-center sm:justify-normal"
        >
          <Save className="w-4 h-4" />
          Update all
        </Button>
        <Button
          disabled={isWorking}
          onClick={() => executeUpdateFunction("remove")}
          className="text-sm text-center sm:text-start flex gap-1 items-center justify-center sm:justify-normal"
        >
          <Trash className="w-4 h-4" />
          Remove
        </Button>
        <Button
          disabled={isWorking}
          onClick={() => executeUpdateFunction("removeAll")}
          className="text-sm text-center sm:text-start flex gap-1 items-center justify-center sm:justify-normal"
        >
          <Trash className="w-4 h-4" />
          Remove all
        </Button>
      </div>
    </div>
  );
}
