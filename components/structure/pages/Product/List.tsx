"use client";
import React, { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import InputBox from "@/components/myui/InputBox";
import { Search } from "lucide-react";
import Label from "@/components/myui/Label";
import ListRow from "./ListRow";
import ProductForm from "./ProductForm";

type Props = {};

const ProductList = (props: Props) => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [filterFound, setFilterFound] = useState(0);
  const [filterText, setFilterText] = useState("");
  const productList = [
    "Product 1",
    "Product 2",
    "Product 3",
    "Product 4",
    "Product 5",
    "Product 6",
    "Product 7",
  ];

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
  };

  const handleFilterTextChange = (value: string) => {
    setFilterText((prev: any) => {
      countFound(`${value}`);
      return value;
    });
  };

  const countFound = (value: string) => {
    let count = 0;
    productList.map((item: string) => {
      if (item.toLowerCase().includes(value.toLowerCase())) {
        count++;
      }
    });
    setFilterFound(count);
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={20} className="pl-2">
        <div className="p-2 flex flex-col gap-2">
          <Label label="Product List" size="text-lg" />
          <div>
            <InputBox
              label="Search"
              setValue={handleFilterTextChange}
              value={filterText}
              subLabel={
                filterText.length > 0
                  ? filterFound > 0
                    ? `Found (${filterFound}) results.`
                    : "0 results found"
                  : ""
              }
            />
          </div>
          <div className="">
            <ScrollArea className="h-[70dvh] ">
              {productList.map((product, index) => {
                if (
                  filterText &&
                  !product.toLowerCase().includes(filterText.toLowerCase())
                ) {
                  return null;
                }
                return (
                  <ListRow
                    key={index}
                    value={product}
                    isSelected={selectedProduct === product}
                    setValue={handleSelectProduct}
                  />
                );
              })}
            </ScrollArea>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="">
        <div className="p-2">
          <div>
            <ProductForm />
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ProductList;
