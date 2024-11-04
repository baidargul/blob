import Tag from "@/components/myui/Tag";
import { formatCurrency } from "@/lib/utils";
import { Formatter } from "@/serverActions/internal/partials/formatters";
import React from "react";

// Define types for nested objects
type Image = {
  id: string;
  name: string;
  extension: string;
  width: string;
  height: string;
  url: string;
  sizeInBytes: string;
};

type ProductImage = {
  id: string;
  productId: string;
  imageId: string;
  images: Image;
};

type Inventory = {
  id: string;
  barcodeRegisterId: string;
  createdAt: string;
  updatedAt: string;
};

type Purchase = {
  id: string;
  vendorId: string | null;
  createdAt: string;
  updatedAt: string;
  orderNo: number;
  closed: boolean;
  purchaseDate: string;
};

type BarcodeRegister = {
  id: string;
  productId: string;
  color: string;
  cost: string;
  invoice: string;
  barcode: string;
  createdAt: string;
  updatedAt: string;
  purchaseId: string;
  purchase: Purchase;
  inventory: Inventory[];
};

type Category = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

type Brand = {
  id: string;
  name: string;
  phone1: string;
  phone2: string;
  address1: string;
  address2: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

type ProductType = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

// Main Product type
type Product = {
  id: string;
  name: string;
  cost: string;
  price: string;
  createdAt: string;
  updatedAt: string;
  brandId: string;
  categoryId: string;
  typeId: string;
  barcodeRegister: BarcodeRegister[];
  category: Category;
  brand: Brand;
  productImages: ProductImage[];
  type: ProductType;
};

type Props = {
  product: Product;
  index: number;
};

const Row = (props: Props) => {
  console.log(props.product);

  return (
    <div
      className={`py-2 grid grid-cols-[.5fr_1fr_2fr_1fr_1fr_1fr_1fr]  truncate justify-items-center ${
        props.index === 1 ? "border-b" : "border-y"
      }`}
    >
      {<div className="opacity-50">{props.index} - </div>}
      <div>
        <Tag
          value={`${props.product.category.name}/${props.product.type.name}`}
          className="tracking-widest"
        />
      </div>
      <div title={props.product.name} className="flex gap-1 items-center">
        <span>{props.product.name}</span>
        <Tag value={props.product.brand.name.toLocaleUpperCase()} />
      </div>
      <div>{props.product.barcodeRegister[0].color}</div>
      <div>{props.product.barcodeRegister[0].barcode}</div>
      <div className="ml-auto">
        {" "}
        {formatCurrency(
          parseInt(props.product.barcodeRegister[0].invoice),
          "Rs"
        )}
      </div>
      <div className="ml-auto">
        {formatCurrency(parseInt(props.product.barcodeRegister[0].cost), "Rs")}
      </div>
    </div>
  );
};

export default Row;
