import Tag from "@/components/myui/Tag";
import { formalizeText } from "@/lib/utils";
import Image from "next/image";
import React from "react";

type Props = {
  item: any;
  index: number;
  key: string;
};

const ProductOrderRow = (props: Props) => {
  console.log(props.item);
  return (
    <div
      key={props.key}
      className={`bg-white hover:bg-gradient-to-r hover:from-white hover:to-interface-hover hover:rounded transition-all duration-500`}
    >
      <div className="p-2 grid grid-cols-[auto_1fr] w-full">
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
      </div>
    </div>
  );
};

export default ProductOrderRow;
