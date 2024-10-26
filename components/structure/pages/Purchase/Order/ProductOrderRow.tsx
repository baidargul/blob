import DialogProvider from "@/components/myui/DialogProvider";
import React from "react";

type Props = {
  item: any;
  index: number;
};

const ProductOrderRow = (props: Props) => {
  return (
    <DialogProvider
      content={<ProductEditor item={{ ...props.item }} />}
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

function ProductEditor({ item }: any) {
  return (
    <div>
      <div>{item.name}</div>
    </div>
  );
}
