"use client";
import React, { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import InputBox from "@/components/myui/InputBox";
import Label from "@/components/myui/Label";
import ListRow from "./ListRow";
import ProductForm from "./ProductForm";
import ProductWindowHeader from "./ProductWindowHeader";
import { serverActions } from "@/serverActions/serverActions";
import { product } from "@prisma/client";

type Props = {};

const ProductList = (props: Props) => {
  const [selectedProduct, setSelectedProduct] = useState<product | null>(null);
  const [filterFound, setFilterFound] = useState(0);
  const [filterText, setFilterText] = useState("");
  const [productList, setProductList] = useState<product[] | any>([]);

  const fetchProducts = async () => {
    const response = await serverActions.product.listAll();
    setProductList((prev: any) => response.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
    productList.map((item: product) => {
      if (item.name.toLowerCase().includes(value.toLowerCase())) {
        count++;
      }
    });
    setFilterFound(count);
  };

  const saveProduct = async (
    name: string,
    cost: number,
    price: number,
    images: string[]
  ) => {
    if (name.length < 1) return;
    const response = await serverActions.product.create(
      name,
      cost,
      price,
      images
    );
    fetchProducts();
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
              {productList.map((product: any, index: number) => {
                if (
                  filterText &&
                  !product.name.toLowerCase().includes(filterText.toLowerCase())
                ) {
                  return null;
                }
                return (
                  <ListRow
                    key={index}
                    value={product.name}
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
            <ProductWindowHeader
              saveProduct={saveProduct}
              product={selectedProduct}
            />
            <ProductForm
              product={selectedProduct}
              setProduct={setSelectedProduct}
            />
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ProductList;
