import InputBox from "@/components/myui/InputBox";
import Label from "@/components/myui/Label";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SERVER_RESPONSE } from "@/serverActions/internal/server";
import { serverActions } from "@/serverActions/serverActions";
import { category, type } from "@prisma/client";
import React, { useEffect, useState } from "react";
import ListRow from "../Product/ListRow";
import TypeHeader from "./TypeHeader";
import TypeForm from "./TypeForm";
import { toast } from "sonner";
import { ComboBox_ADD_VALUE_TO_EACH_OPTION } from "@/components/myui/ComboBox";

type Props = {};

const TypeList = (props: Props) => {
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [typeList, setTypeList] = useState<type[] | any>([]);
  const [categoryList, setCategoryList] = useState<category[] | any>([]);
  const [selectedType, setSelectedType] = useState<type | null | any>(null);
  const [filterFound, setFilterFound] = useState(0);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    fetchTypes();
    fetchCategories();
  }, []);

  const handleSelectType = (item: any) => {
    setIsReadOnly(true);
    setSelectedType(item);
  };

  const handleFilterTextChange = (value: string) => {
    setFilterText((prev: any) => {
      countFound(`${value}`);
      return value;
    });
  };

  const countFound = (value: string) => {
    let count = 0;
    typeList.map((item: type) => {
      if (item.name.toLowerCase().includes(value.toLowerCase())) {
        count++;
      }
    });
    setFilterFound(count);
  };

  const fetchTypes = async () => {
    const response = await serverActions.Type.listAll();
    setTypeList((prev: any) => response.data);
    setIsReadOnly(false);
  };
  const fetchCategories = async () => {
    setCategoryList([]);
    const response = await serverActions.Category.listAll();
    let data = ComboBox_ADD_VALUE_TO_EACH_OPTION(response.data);
    setCategoryList(data);
    setIsReadOnly(false);
  };

  const handleSetType = (item: any) => {
    setSelectedType(item);
  };

  const createNewType = () => {
    const temp: type | any = {
      id: "",
      name: "",
      description: "",
      createdAt: null,
      updatedAt: null,
    };
    fetchCategories();
    setIsReadOnly(false);
    setSelectedType(temp);
  };

  const saveType = async (
    name: string,
    category: string,
    description: string
  ) => {
    const response: SERVER_RESPONSE = await serverActions.Type.create(
      name,
      category,
      description
    );

    if (response.status === 200) {
      await fetchTypes();
      await fetchCategories();
      createNewType();
    } else if (response.status === 400) {
      toast.warning(response.message);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={40} className="w-full min-w-[260px]">
        <ScrollArea className="h-[88dvh]">
          <div>
            <Label
              label="Type List"
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
                    placeholder="Type"
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
                  <div className="grid grid-cols-2 gap-2 w-full bg-zinc-300 p-2">
                    <div>Type</div>
                    <div>Category</div>
                  </div>
                  <ScrollArea className="h-[40dvh] border rounded">
                    {typeList.map((item: any, index: number) => {
                      const lowerFilterText = filterText.toLowerCase();
                      const isExists =
                        item.name.toLowerCase().includes(lowerFilterText) ||
                        item.category.name
                          .toLowerCase()
                          .includes(lowerFilterText);

                      if (!isExists && filterText) {
                        return null;
                      }

                      return (
                        <ListRow
                          key={index}
                          value={item.name}
                          product={item}
                          isSelected={selectedType?.name === item.name}
                          setValue={handleSelectType}
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
          <TypeHeader
            type={selectedType}
            fetchTypes={fetchTypes}
            fetchCategories={fetchCategories}
            createType={createNewType}
            saveType={saveType}
            isReadOnly={isReadOnly}
          />
          <TypeForm
            selectedType={selectedType}
            setType={handleSetType}
            isReadOnly={isReadOnly}
            categoryList={categoryList}
          />
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default TypeList;
