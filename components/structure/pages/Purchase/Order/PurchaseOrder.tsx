import Label from "@/components/myui/Label";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState } from "react";
import PurchaseProductForm from "./PurchaseProductForm";
import Button from "@/components/myui/Button";
import { product, purchase } from "@prisma/client";
import { serverActions } from "@/serverActions/serverActions";

type Props = {};

const PurchaseOrder = (props: Props) => {
  const [purchaseOrder, setPurchaseOrder] = useState<purchase | null>(null);
  const [productList, setProductList] = useState<product[] | null>(null);

  const handleCreateNewPurchaseOrder = async () => {
    const purchase = await serverActions.Purchase.create();
    if (purchase.status === 200) {
      setPurchaseOrder(purchase.data);
    }
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={40} className="w-full min-w-[260px]">
        <div>
          <Label
            label="Purchase Order"
            size="text-lg"
            className="text-start text-2xl my-2"
            color="text-interface-primary"
          />
          <div className="flex gap-2 items-center ">
            {!purchaseOrder && (
              <Button onClick={handleCreateNewPurchaseOrder}>Create</Button>
            )}
            {purchaseOrder && purchaseOrder.closed === false && (
              <Button onClick={handleCreateNewPurchaseOrder}>Save</Button>
            )}
            {purchaseOrder && purchaseOrder.closed === false && (
              <Button onClick={handleCreateNewPurchaseOrder}>Close</Button>
            )}
          </div>
          <div>
            <div className="flex flex-col gap-2 px-0 pr-2 mt-4">
              <div></div>
              <div className="">
                {purchaseOrder && purchaseOrder.id?.length > 0 && (
                  <PurchaseProductForm
                    purchaseOrder={purchaseOrder}
                    productList={productList}
                    setProductList={setProductList}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <ScrollArea className="h-[88dvh] pl-2">
          <div>
            <div className="flex flex-col gap-2">
              {productList &&
                productList.length > 0 &&
                productList.map((item: any, index: number) => {
                  console.log(item);
                  return (
                    <div
                      key={item.id}
                      className="p-2 bg-white rounded flex gap-1 items-start"
                    >
                      <div className="font-bold text-interface-text/30">
                        {index + 1}-
                      </div>
                      <div className="flex flex-col gap-1 w-full">
                        <div className="font-semibold tracking-tight text-interface-text/80 text-sm flex justify-between items-center">
                          <div className="text-base">
                            {item.name} [
                            {String(item.brand.name).toLocaleUpperCase()}]
                          </div>
                          <div className="text-xs tracking-widest">
                            {item.category.name}/{item.type.name}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs tracking-widest flex gap-2">
                            <div className="flex gap-1 items-center">
                              <div className="font-semibold">Cost:</div>{" "}
                              {item.barcodeRegister[0].cost}
                            </div>
                            <div className="flex gap-1 items-center">
                              <div className="font-semibold">Invoice:</div>{" "}
                              {item.barcodeRegister[0].invoice}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default PurchaseOrder;
