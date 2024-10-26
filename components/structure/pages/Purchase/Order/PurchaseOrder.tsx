import Label from "@/components/myui/Label";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect, useState } from "react";
import PurchaseProductForm from "./PurchaseProductForm";
import Button from "@/components/myui/Button";
import { product, purchase } from "@prisma/client";
import { serverActions } from "@/serverActions/serverActions";
import ProductOrderRow from "./ProductOrderRow";

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

  const handleAddToCart = async (
    productId: string,
    color: string,
    cost: number,
    invoice: number,
    barcode: string
  ) => {
    if (!purchaseOrder) {
      alert("Purchase Order is not created");
      return;
    }

    const product = await serverActions.Purchase.addProduct(
      purchaseOrder.id,
      productId,
      color,
      cost,
      invoice,
      barcode
    );

    if (product.status === 200) {
      setProductList((prev: any) => [...(prev || []), product.data]);
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
              <Button onClick={handleCreateNewPurchaseOrder}>
                Close order
              </Button>
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
                    handleAddToCart={handleAddToCart}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="min-w-[280px]">
        <ScrollArea className="h-[88dvh] pl-2">
          <div>
            <div className="flex flex-col gap-2">
              {productList &&
                productList.length > 0 &&
                productList.map((item: any, index: number) => {
                  return (
                    <ProductOrderRow
                      item={item}
                      index={index}
                      key={`${item.id}-${index}`}
                    />
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
