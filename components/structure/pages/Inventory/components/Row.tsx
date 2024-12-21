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
  const ItemAge = calculateStockAge(
    new Date(
      props.product.barcodeRegister[0].inventory[0].createdAt.toLocaleLowerCase()
    ).toDateString()
  );

  return (
    <div
      className={`py-2 group cursor-pointer text-sm min-w-[440px] grid grid-cols-[.0fr_2fr_2fr_1fr_.2fr_.2fr]  md:grid-cols-[.3fr_2fr_1fr_1fr_2fr_.2fr_.2fr] lg:grid-cols-[.5fr_1fr_2fr_1fr_1fr_1fr_1fr_.2fr]  truncate justify-items-center place-items-center ${
        props.index === 1 ? "border-b" : "border-y"
      }`}
    >
      {
        <div className="opacity-50 group-hover:opacity-100 group-hover:font-bold group-hover:text-black/80">
          {props.index} -{" "}
        </div>
      }
      <div className="hidden lg:block">
        <Tag
          value={`${props.product.category.name}/${props.product.type.name}`}
          className="tracking-widest"
        />
      </div>
      <div title={props.product.name} className="flex gap-1 items-center">
        <div className="hidden md:block group-hover:font-bold group-hover:text-black/80">
          {props.product.name}
        </div>
        <div className="md:hidden flex flex-col text-center justify-center">
          <div>{props.product.name}</div>
          <div className="text-xs tracking-wide scale-90">
            {props.product.brand.name.toLocaleUpperCase()} -{" "}
            {props.product.category.name.toLocaleUpperCase()}
          </div>
        </div>
        <div className="hidden md:block">
          <Tag value={props.product.brand.name.toLocaleUpperCase()} />
        </div>
      </div>
      <div className="hidden md:block">
        {props.product.barcodeRegister[0].color}
      </div>
      <div className="tracking-widest">
        {props.product.barcodeRegister[0].barcode}
        <div className="md:hidden text-xs tracking-wide scale-90 -ml-2">
          {props.product.type.name.toLocaleUpperCase()} |{" "}
          {props.product.barcodeRegister[0].color.toLocaleUpperCase()}
        </div>
      </div>
      <div className="ml-auto">
        <div className="hidden lg:block">
          {formatCurrency(
            parseInt(props.product.barcodeRegister[0].invoice),
            "Rs"
          )}
        </div>
        <div className="lg:hidden flex flex-col text-sm tracking-widest gap-1">
          <div className="border-b">
            {formatCurrency(
              parseInt(props.product.barcodeRegister[0].invoice),
              "Rs"
            )}
          </div>
          <div className="">
            {formatCurrency(
              parseInt(props.product.barcodeRegister[0].cost),
              "Rs"
            )}
          </div>
        </div>
      </div>
      <div className="ml-auto">
        <div className="hidden lg:block pr-2">
          {formatCurrency(
            parseInt(props.product.barcodeRegister[0].cost),
            "Rs"
          )}
        </div>
      </div>
      <div className="ml-auto opacity-50 text-xs pr-2">{ItemAge}</div>
    </div>
  );
};

export default Row;

function calculateStockAge(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days >= 0 && days < 30) {
    return `${days === 1 ? "1 day" : `${days} days`}`;
  } else if (days >= 30 && days < 365) {
    const months = Math.floor(days / 30);
    return `${months} months`;
  } else if (days >= 365) {
    const years = Math.floor(days / 365);
    return `${years} years`;
  } else {
    return "Unknown";
  }
}
