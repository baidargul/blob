"use client";
import Button from "@/components/myui/Button";
import {
  Combobox,
  ComboBox_ADD_VALUE_TO_EACH_OPTION,
} from "@/components/myui/ComboBox";
import InputBox from "@/components/myui/InputBox";
import Label from "@/components/myui/Label";
import Loader from "@/components/myui/Loader";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/lib/utils";
import { serverActions } from "@/serverActions/serverActions";
import { product, sale } from "@prisma/client";
import {
  Check,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {};

const SaleOrder = (props: Props) => {
  const [saleOrder, setSaleOrder] = useState<sale | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [isWorking, setIsWorking] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<product | null>(null);
  const [productList, setProductList] = useState<product[]>([]);

  const handleFirstOrder = async () => {};
  const handlePreviousOrder = async () => {};
  const handleNextOrder = async () => {};
  const handleLastOrder = async () => {};
  const handleCreateNewSaleOrder = async () => {};
  const handleCloseInvoice = async () => {};
  const handleSearchProduct = (value: string) => {};
  const handleProductSelect = (product: product) => {
    setSelectedProduct(product);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await serverActions.Product.listAll();
    response.data = ComboBox_ADD_VALUE_TO_EACH_OPTION(response.data);
    setProductList((prev: any) => response.data);
  };

  function sumTotal() {
    return 0;
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="relative">
      <ResizablePanel defaultSize={40} className="w-full min-w-[260px]">
        <div className="relative h-full">
          <div>
            <div className="flex flex-col mb-2 lg:mb-0 lg:flex-row justify-between items-center lg:pr-2">
              <div
                className={`transition-all duration-800 ${
                  saleOrder && saleOrder.closed === true
                    ? "bg-interface-primary group p-1 scale-75 flex gap-1 items-center -ml-4 lg:-ml-4 -mr-5 lg:mr-0 mb-1 lg:mb-0 px-4 rounded-md ring-2 ring-interface-primary ring-offset-2"
                    : "bg-transparent"
                }`}
              >
                {saleOrder && saleOrder.closed === true && (
                  <Check className="w-6 h-6 text-white group-hover:-rotate-12 transition-all duration-200" />
                )}
                <Label
                  label="New Sale Order"
                  size="text-lg"
                  className="text-start text-2xl my-2"
                  color={`${
                    saleOrder && saleOrder.closed === true
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
              {!saleOrder?.orderNo && (
                <Button onClick={handleCreateNewSaleOrder}>Create</Button>
              )}
              {saleOrder && saleOrder.closed === false && (
                <Button onClick={handleCreateNewSaleOrder}>Save</Button>
              )}
              {saleOrder && saleOrder.closed === false && (
                <Button onClick={handleCloseInvoice}>Close order</Button>
              )}
            </div>
            <div>
              <div className="flex flex-col gap-2 px-0 pr-2 mt-4">
                <div>
                  <InputBox label="Search Product" />
                  <Combobox
                    options={productList}
                    label="Select Product"
                    setValue={handleProductSelect}
                  />
                </div>
                <div
                  className={
                    saleOrder && saleOrder.closed === true
                      ? "opacity-50 pointer-events-none  cursor-not-allowed"
                      : "opacity-100"
                  }
                >
                  {saleOrder && saleOrder.id?.length > 0 && (
                    <div></div>
                    // <PurchaseProductForm
                    //   saleOrder={saleOrder}
                    //   productList={productList}
                    //   setProductList={setProductList}
                    //   handleAddToCart={handleAddToCart}
                    //   vendorList={vendorList}
                    //   setSelectedVendor={handleVendorSelect}
                    //   selectedVendor={selectedVendor}
                    // />
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
          saleOrder && saleOrder.closed === true
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
            className="pointer-events-auto opacity-100"
          />
        </div>
        <ScrollArea className="h-[88dvh] pl-2">
          <div>
            {/* <div className="flex flex-col gap-2">
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
                    item.type.name
                      .toLowerCase()
                      .includes(searchText.toLowerCase())
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
                    item.brand.description
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
                    item.barcodeRegister[0].color
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
                    item.category.description &&
                    item.category.description
                      .toLowerCase()
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
            </div> */}
          </div>
        </ScrollArea>
      </ResizablePanel>
      {isWorking && <Loader />}
    </ResizablePanelGroup>
  );
};

export default SaleOrder;
