import InputBox from "@/components/myui/InputBox";
import Label from "@/components/myui/Label";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect, useState } from "react";
import ListRow from "../Product/ListRow";
import CategoryHeader from "./CategoryHeader";
import CategoryForm from "./CategoryForm";
import { SERVER_RESPONSE } from "@/serverActions/internal/server";
import { serverActions } from "@/serverActions/serverActions";
import { category } from "@prisma/client";

type Props = {};

const CategoryList = (props: Props) => {
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [categoryList, setCategoryList] = useState<category[] | any>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    category | null | any
  >(null);
  const [filterFound, setFilterFound] = useState(0);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSelectBrand = (item: any) => {
    setIsReadOnly(true);
    setSelectedCategory(item);
  };

  const handleFilterTextChange = (value: string) => {
    setFilterText((prev: any) => {
      countFound(`${value}`);
      return value;
    });
  };

  const countFound = (value: string) => {
    let count = 0;
    categoryList.map((item: category) => {
      if (item.name.toLowerCase().includes(value.toLowerCase())) {
        count++;
      }
    });
    setFilterFound(count);
  };

  const fetchCategories = async () => {
    const response = await serverActions.Category.listAll();
    setCategoryList((prev: any) => response.data);
    setIsReadOnly(false);
  };

  const handleSetCategory = (item: any) => {
    setSelectedCategory(item);
  };

  const createNewCategory = () => {
    const temp: category = {
      id: "",
      name: "",
      description: "",
      createdAt: null,
      updatedAt: null,
    };

    setIsReadOnly(false);
    setSelectedCategory(temp);
  };

  const saveCategory = async (name: string, description: string) => {
    const response: SERVER_RESPONSE = await serverActions.Category.create(
      name,
      description
    );

    if (response.status === 200) {
      await fetchCategories();
      createNewCategory();
    }
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={40} className="w-full min-w-[260px]">
        <ScrollArea className="h-[88dvh]">
          <div>
            <Label
              label="Category List"
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
                    placeholder="Category"
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
                    {categoryList.map((item: any, index: number) => {
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
                          isSelected={selectedCategory?.name === item.name}
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
          <CategoryHeader
            category={selectedCategory}
            fetchCategories={fetchCategories}
            createCategory={createNewCategory}
            saveCategory={saveCategory}
            isReadOnly={isReadOnly}
          />
          <CategoryForm
            selectedCategory={selectedCategory}
            setCategory={handleSetCategory}
            isReadOnly={isReadOnly}
          />
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default CategoryList;
