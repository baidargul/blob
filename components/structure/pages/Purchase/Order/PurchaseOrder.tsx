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
  Check,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import InputBox from "@/components/myui/InputBox";

type Props = {};

const PurchaseOrder = (props: Props) => {
  const [purchaseOrder, setPurchaseOrder] = useState<purchase | null>(null);
  const [productList, setProductList] = useState<product[] | any | null>(null);
  const [searchText, setSearchText] = useState<string>("");

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

    if (order.status === 200) {
      setPurchaseOrder(order.data);
      setProductList(order.data.products);
    }
  };
  const handlePreviousOrder = async () => {
    const order = await serverActions.Purchase.get.previous(
      purchaseOrder && purchaseOrder.id ? purchaseOrder.id : ""
    );

    if (order.status === 200) {
      setPurchaseOrder(order.data);
      setProductList(order.data.products);
    }
  };
  const handleFirstOrder = async () => {
    const order = await serverActions.Purchase.get.first();
    if (order.status === 200) {
      setPurchaseOrder(order.data);
      setProductList(order.data.products);
    }
  };
  const handleLastOrder = async () => {
    const order = await serverActions.Purchase.get.last();

    if (order.status === 200) {
      setPurchaseOrder(order.data);
      setProductList(order.data.products);
    }
  };

  const handleCloseInvoice = async () => {
    if (!purchaseOrder) return null;
    const order = await serverActions.Purchase.toggleClose(purchaseOrder.id);

    if (order.status === 200) {
      setPurchaseOrder(order.data);
      setProductList(order.data.products);
    }
  };

  const handleSearchProduct = (value: string) => {
    setSearchText(value);
  };

  const sumTotal = () => {
    let total = 0;
    if (productList) {
      for (const item of productList) {
        total += parseInt(item.barcodeRegister[0].cost);
      }
    }
    return total;
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={40} className="w-full min-w-[260px]">
        <div className="relative h-full">
          <div>
            <div className="flex flex-col mb-2 lg:mb-0 lg:flex-row justify-between items-center lg:pr-2">
              <div
                className={`transition-all duration-800 ${
                  purchaseOrder && purchaseOrder.closed === true
                    ? "bg-interface-primary group p-1 scale-75 flex gap-1 items-center -ml-4 lg:ml-0 -mr-5 lg:mr-0 mb-1 lg:mb-0 px-4 rounded-md ring-2 ring-interface-primary ring-offset-2"
                    : "bg-transparent"
                }`}
              >
                {purchaseOrder && purchaseOrder.closed === true && (
                  <Check className="w-6 h-6 text-white group-hover:-rotate-12 transition-all duration-200" />
                )}
                <Label
                  label="Purchase Order"
                  size="text-lg"
                  className="text-start text-2xl my-2"
                  color={`${
                    purchaseOrder && purchaseOrder.closed === true
                      ? "text-white"
                      : "text-interface-primary"
                  }`}
                />
              </div>
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
                <Button onClick={handleCloseInvoice}>Close order</Button>
              )}
            </div>
            <div>
              <div className="flex flex-col gap-2 px-0 pr-2 mt-4">
                <div></div>
                <div
                  className={
                    purchaseOrder && purchaseOrder.closed === true
                      ? "opacity-50 pointer-events-none  cursor-not-allowed"
                      : "opacity-100"
                  }
                >
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
          <div className="bg-interface-primary w-[98.8%] py-1 rounded pl-2 bottom-0 absolute text-white ">
            {formatCurrency(sumTotal(), "Rs")}
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel
        className={`min-w-[280px] ${
          purchaseOrder && purchaseOrder.closed === true
            ? "opacity-50 pointer-events-none  cursor-not-allowed"
            : "opacity-100"
        }`}
      >
        <div className="p-2 pr-0">
          <InputBox
            label="Search"
            placeholder="Search Product"
            setValue={handleSearchProduct}
            value={searchText}
          />
        </div>
        <ScrollArea className="h-[88dvh] pl-2">
          <div>
            <div className="flex flex-col gap-2">
              {productList &&
                productList.length > 0 &&
                productList.map((item: any, index: number) => {

                  let isExists = false;

                  if (
                    item.name.toLowerCase().includes(searchText.toLowerCase())
                  ) {
                    isExists = true;
                  }

                  if (
                    item.brand.name
                      .toLowerCase()
                      .includes(searchText.toLowerCase())
                  ) {
                    isExists = true;
                  }

                  if (
                    item.brand.description?
                      .toLowerCase()
                      .includes(searchText.toLowerCase())
                  ) {
                    isExists = true;
                  }

                  if (
                    item.barcodeRegister[0].barcode
                      .toLowerCase()
                      .includes(searchText.toLowerCase())
                  ) {
                    isExists = true;
                  }

                  if (
                    item.category.name
                      .toLowerCase()
                      .includes(searchText.toLowerCase())
                  ) {
                    isExists = true;
                  }

                  if (
                    item.category.description &&  item.category.description.toLowerCase()
                      .includes(searchText.toLowerCase())
                  ) {
                    isExists = true;
                  }

                  if (
                    item.price.toLowerCase().includes(searchText.toLowerCase())
                  ) {
                    isExists = true;
                  }

                  if (
                    item.cost.toLowerCase().includes(searchText.toLowerCase())
                  ) {
                    isExists = true;
                  }

                  if (!isExists) {
                    return null;
                  }

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
