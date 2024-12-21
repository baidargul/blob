import InputBox from "@/components/myui/InputBox";
import Tag from "@/components/myui/Tag";
import { formalizeText } from "@/lib/utils";
import { Trash } from "lucide-react";
import Image from "next/image";
import React from "react";

type Props = {
  item: any;
  index: number;
  removeRow: (barcode: string) => void;
  changeAmount: (barcode: string, amount: number) => void;
};

const ProductOrderRow = (props: Props) => {
  const handleAmountChange = (value: string) => {
    props.changeAmount(props.item.barcodeRegister[0].barcode, parseInt(value));
  };

  return (
    <div
      className={`relative bg-white hover:drop-shadow-lg hover:bg-gradient-to-r hover:from-white hover:to-interface-hover/30 hover:rounded transition-all duration-500`}
    >
      <div
        title="Remove product"
        onClick={() => props.removeRow(props.item.barcodeRegister[0].barcode)}
        className="p-1 group w-6 h-6 text-center flex justify-center items-center bg-interface-primary/10 hover:bg-red-50 border border-transparent hover:border-red-100 rounded absolute top-2 right-2"
      >
        <Trash size={20} className="group-hover:text-red-500 cursor-pointer" />
      </div>
      <div className="p-2 grid grid-cols-[auto_1fr_1fr] w-full">
        <div>
          <Image
            src={props.item.productImages[0].images.url}
            alt={props.item.name}
            width={100}
            height={100}
            className="w-24 h-24 object-contain rounded"
          />
        </div>
        <div className="">
          <div>
            <Tag value={props.item.brand.name.toString().toUpperCase()} />
          </div>
          <div className="text-lg font-semibold">{props.item.name}</div>
          <div className="text-xs tracking-widest">
            {props.item.barcodeRegister[0].barcode}
          </div>
          <div className="flex gap-1 items-center text-sm italic">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: props.item.barcodeRegister[0].color,
              }}
            ></div>
            {formalizeText(props.item.barcodeRegister[0].color)}
          </div>
        </div>
        <div className="h-full flex flex-col justify-center">
          <InputBox
            label="Amount"
            setValue={handleAmountChange}
            value={props.item.amount | 0}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductOrderRow;
