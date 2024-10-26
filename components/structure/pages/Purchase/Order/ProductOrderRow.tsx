import React from "react";

type Props = {
  item: any;
  index: number;
};

const ProductOrderRow = (props: Props) => {
  return (
    <div className="p-2 bg-white rounded flex gap-1 items-start">
      <div className="font-bold text-interface-text/30">{props.index + 1}-</div>
      <div className="flex flex-col gap-1 w-full">
        <div className="font-semibold tracking-tight text-interface-text/80 text-sm flex justify-between items-center">
          <div className="text-base">
            {props.item.name}
            {` [${String(props.item.brand.name).toLocaleUpperCase()}]`}
          </div>
          <div className="text-xs tracking-widest">
            <div>
              <div>
                {props.item.category.name}/{props.item.type.name}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="text-xs tracking-widest flex gap-2 justify-between items-end">
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
            <div className="border-b">
              {props.item.barcodeRegister[0].barcode}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOrderRow;
