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

type Props = {};

const ProductList = (props: Props) => {
  const [selectedProduct, setSelectedProduct] = useState("");
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
    setFilterText(value);
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
      <ResizablePanel className="pl-2">
        <div className="p-2">
          <div>Properties</div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ProductList;