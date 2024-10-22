import InputBox from "@/components/myui/InputBox";
import Label from "@/components/myui/Label";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { serverActions } from "@/serverActions/serverActions";
import { brand } from "@prisma/client";
import React, { useEffect, useState } from "react";
import ListRow from "../Product/ListRow";
import BrandForm from "./BrandForm";
import BrandHeader from "./BrandHeader";
import { SERVER_RESPONSE } from "@/serverActions/internal/server";

type Props = {};

const BrandList = (props: Props) => {
  const [brandList, setBrandList] = useState<brand[] | any>([]);
  const [selectedBrand, setSelectedBrand] = useState<brand | null | any>(null);
  const [filterFound, setFilterFound] = useState(0);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleSelectBrand = (item: any) => {
    setSelectedBrand(item);
  };

  const handleFilterTextChange = (value: string) => {
    setFilterText((prev: any) => {
      countFound(`${value}`);
      return value;
    });
  };

  const countFound = (value: string) => {
    let count = 0;
    brandList.map((item: brand) => {
      if (item.name.toLowerCase().includes(value.toLowerCase())) {
        count++;
      }
    });
    setFilterFound(count);
  };

  const fetchBrands = async () => {
    const response = await serverActions.Brand.listAll();
    setBrandList((prev: any) => response.data);
  };

  const handleSetBrand = (item: any) => {
    setSelectedBrand(item);
  };

  const createNewBrand = () => {
    const temp: brand = {
      id: "",
      name: "",
      phone1: "",
      phone2: "",
      address1: "",
      address2: "",
      description: "",
      createdAt: null,
      updatedAt: null,
    };

    setSelectedBrand(temp);
  };

  const saveBrand = async (
    name: string,
    phone1: string,
    phone2: string,
    address1: string,
    address2: string,
    description: string
  ) => {
    const response: SERVER_RESPONSE = await serverActions.Brand.create(
      name,
      phone1,
      phone2,
      address1,
      address2,
      description
    );

    if (response.status === 200) {
      await fetchBrands();
      createNewBrand();
    }
  };
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={40} className="w-full min-w-[260px]">
        <ScrollArea className="h-[88dvh]">
          <div>
            <Label
              label="Brand List"
              size="text-lg"
              className="text-2xl my-2"
              color=""
            />
            <div>
              <div className="flex flex-col gap-2 pl-2 pr-4 mt-4">
                <div>
                  <InputBox
                    label="Search"
                    setValue={handleFilterTextChange}
                    value={filterText}
                    placeholder="Brand"
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
                    {brandList.map((item: any, index: number) => {
                      if (
                        filterText &&
                        !item.name
                          .toLowerCase()
                          .includes(filterText.toLowerCase())
                      ) {
                        return null;
                      }
                      return (
                        <ListRow
                          key={index}
                          value={item.name}
                          product={item}
                          isSelected={selectedBrand?.name === item.name}
                          setValue={handleSelectBrand}
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
        <ScrollArea className="h-[88dvh]">
          <BrandHeader
            brand={selectedBrand}
            fetchBrands={fetchBrands}
            createBrand={createNewBrand}
            saveBrand={saveBrand}
          />
          <BrandForm selectedBrand={selectedBrand} setBrand={handleSetBrand} />
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default BrandList;
