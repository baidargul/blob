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
import { SERVER_RESPONSE } from "@/serverActions/internal/server";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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

  const updateProducts = async (
    item: any,
    command: "update" | "updateAll" | "remove" | "removeAll",
    barcode: string,
    color?: string,
    cost?: number,
    invoice?: number,
    setWait?: any
  ) => {
    if (setWait) {
      setWait(true);
    }
    const temp: any = productList;

    // Helper function to check if two products are the same
    function isSameProduct(target: any) {
      return (
        target.name === item.name &&
        target.brand.name === item.brand.name &&
        target.category.name === item.category.name &&
        target.type.name === item.type.name
      );
    }

    let newData = [];

    for (const target of temp) {
      if (isSameProduct(target)) {
        switch (command) {
          case "update":
            if (
              target.barcodeRegister[0].barcode ===
              item.barcodeRegister[0].barcode
            ) {
              target.barcodeRegister[0].color = color;
              target.barcodeRegister[0].cost = cost;
              target.barcodeRegister[0].invoice = invoice;
            }
            const res: SERVER_RESPONSE =
              await serverActions.Purchase.updateProduct(
                target.barcodeRegister[0].id,
                barcode,
                color,
                cost,
                invoice
              );
            if (
              res.status === 200 ||
              res.message === "Barcode already alloted to other product!"
            ) {
              newData.push(target);
            }
            break;

          case "updateAll":
            target.barcodeRegister[0].color = color;
            target.barcodeRegister[0].cost = cost;
            target.barcodeRegister[0].invoice = invoice;
            const ress: SERVER_RESPONSE =
              await serverActions.Purchase.updateProduct(
                target.barcodeRegister[0].id,
                barcode,
                color,
                cost,
                invoice
              );
            if (
              ress.status === 200 ||
              ress.message === "Barcode already alloted to other product!"
            ) {
              newData.push(target);
            }
            break;

          case "remove":
            if (
              target.barcodeRegister[0].barcode !==
              item.barcodeRegister[0].barcode
            ) {
              newData.push(target);
            } else {
              const ress: SERVER_RESPONSE =
                await serverActions.Purchase.deleteProduct(
                  target.barcodeRegister[0].id
                );
            }
            break;

          case "removeAll":
            await serverActions.Purchase.deleteProduct(
              target.barcodeRegister[0].id
            );
            break;

          default:
            newData.push(target);
        }
      } else {
        // For non-matching products, always add them to newData
        newData.push(target);
      }
    }

    // Update the state with the modified product list
    setProductList(newData);
    if (setWait) {
      setWait(false);
    }
  };

  const handleNextOrder = async () => {
    if (!purchaseOrder) return null;
    const order = await serverActions.Purchase.get.next(purchaseOrder.id);

    console.log(order);
    if (order.status === 200) {
      setPurchaseOrder(order.data);
      setProductList(order.data.products);
    }
  };
  const handlePreviousOrder = async () => {
    const order = await serverActions.Purchase.get.previous(
      purchaseOrder && purchaseOrder.id ? purchaseOrder.id : ""
    );

    console.log(order);
    if (order.status === 200) {
      setPurchaseOrder(order.data);
      setProductList(order.data.products);
    }
  };
  const handleFirstOrder = async () => {
    const order = await serverActions.Purchase.get.first();
    console.log(order);
    if (order.status === 200) {
      setPurchaseOrder(order.data);
      setProductList(order.data.products);
    }
  };
  const handleLastOrder = async () => {
    const order = await serverActions.Purchase.get.last();

    console.log(order);
    if (order.status === 200) {
      setPurchaseOrder(order.data);
      setProductList(order.data.products);
    }
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={40} className="w-full min-w-[260px]">
        <div>
          <div className="flex justify-between items-center pr-2">
            <Label
              label="Purchase Order"
              size="text-lg"
              className="text-start text-2xl my-2"
              color="text-interface-primary"
            />
            <div className="flex gap-2">
              <Button onClick={handleFirstOrder}>
                <ChevronFirst className="w-3 h-3" />
              </Button>
              <Button onClick={handlePreviousOrder}>
                <ChevronLeft className="w-3 h-3" />
              </Button>
              <Button onClick={handleNextOrder}>
                <ChevronRight className="w-3 h-3" />
              </Button>
              <Button onClick={handleLastOrder}>
                <ChevronLast className="w-3 h-3" />
              </Button>
            </div>
          </div>
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
                      index={index + 1}
                      key={`${item.id}-${index}`}
                      updateProducts={updateProducts}
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
