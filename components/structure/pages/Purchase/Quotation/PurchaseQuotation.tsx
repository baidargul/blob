import React, { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import Label from "@/components/myui/Label";
import { product } from "@prisma/client";
import { serverActions } from "@/serverActions/serverActions";
import ListRow from "../../Product/ListRow";
import InputBox from "@/components/myui/InputBox";

type Props = {};

const PurchaseQuotation = (props: Props) => {
  const [selectedProduct, setSelectedProduct] = useState<product | null | any>(
    null
  );
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

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={40} className="w-full min-w-[260px]">
        <ScrollArea className="h-[88dvh]">
          <div>
            <Label
              label="Purchase Quotation"
              size="text-lg"
              className="text-center text-2xl my-2"
              color="text-interface-primary"
            />
            <div>
              <div className="flex flex-col gap-2 pl-2 pr-4 mt-4">
                <div>
                  <InputBox
                    label="Search"
                    setValue={handleFilterTextChange}
                    value={filterText}
                    placeholder="Product"
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
                  <ScrollArea className="h-[40dvh] border rounded">
                    {productList.map((product: any, index: number) => {
                      if (
                        filterText &&
                        !product.name
                          .toLowerCase()
                          .includes(filterText.toLowerCase())
                      ) {
                        return null;
                      }
                      return (
                        <ListRow
                          key={index}
                          value={product.name}
                          product={product}
                          isSelected={selectedProduct?.name === product.name}
                          setValue={handleSelectProduct}
                        />
                      );
                    })}
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <ScrollArea className="h-[88dvh]"></ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default PurchaseQuotation;
