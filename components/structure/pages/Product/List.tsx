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
import { brand, category, product, type } from "@prisma/client";

type Props = {};

const ProductList = (props: Props) => {
  const [selectedProduct, setSelectedProduct] = useState<product | null | any>(
    null
  );
  const [selectedBrand, setSelectedBrand] = useState<brand | null | any>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    category | null | any
  >();
  const [selectedType, setSelectedType] = useState<type | null | any>();
  const [filterFound, setFilterFound] = useState(0);
  const [filterText, setFilterText] = useState("");
  const [productList, setProductList] = useState<product[] | any>([]);
  const [brandList, setBrandList] = useState<brand[] | any>([]);
  const [categoryList, setCategoryList] = useState<category[] | any>([]);
  const [typeList, setTypeList] = useState<type[] | any>([]);

  const fetchProducts = async () => {
    const response = await serverActions.Product.listAll();
    setProductList((prev: any) => response.data);
  };

  const fetchBrands = async () => {
    const response = await serverActions.Brand.listAll();
    setBrandList((prev: any) => response.data);
  };

  const fetchCategories = async () => {
    const response = await serverActions.Category.listAll();
    setCategoryList((prev: any) => response.data);
  };

  const fetchTypes = async () => {
    const response = await serverActions.Type.listAll();
    setTypeList((prev: any) => response.data);
  };

  useEffect(() => {
    fetchProducts();
    fetchBrands();
    fetchCategories();
    fetchTypes();
  }, []);

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
  };

  const handleSelectBrand = (brand: brand) => {
    setSelectedBrand(brand);
  };

  const handleSelectCategory = (category: category) => {
    setSelectedCategory(category);
  };

  const handleSelectType = (type: type) => {
    setSelectedType(type);
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

  const createNewProduct = () => {
    const product = {
      name: "",
      cost: 0,
      price: 0,
      images: [],
    };

    setSelectedProduct((prev: any) => product);
  };

  const saveProduct = async (
    name: string,
    cost: number,
    price: number,
    images: string[],
    brand: brand | null | any,
    category: category | null | any,
    type: type | null | any
  ) => {
    if (name.length < 1) return;
    const response = await serverActions.Product.create(
      name,
      cost,
      price,
      images,
      brand,
      category,
      type
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
            <ScrollArea className="h-[72dvh]">
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
                    product={product}
                    isSelected={selectedProduct?.name === product.name}
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
              brand={selectedBrand}
              category={selectedCategory}
              type={selectedType}
              createProduct={createNewProduct}
              fetchProducts={fetchProducts}
            />
            <ProductForm
              brandList={brandList}
              product={selectedProduct}
              setProduct={setSelectedProduct}
              setBrand={handleSelectBrand}
              selectedBrand={selectedBrand}
              categoryList={categoryList}
              typeList={typeList}
              selectedCategory={selectedCategory}
              selectedType={selectedType}
              setType={handleSelectType}
              setCategory={handleSelectCategory}
            />
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ProductList;
