import Tag from "@/components/myui/Tag";
import { Barcode, Palette, Receipt, ReceiptCent } from "lucide-react";
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

const ProductViewer = (props: Props) => {
  const handlePropertyClick = (value: string) => {
    navigator.clipboard.writeText(props.product.barcodeRegister[0].barcode);
  };

  return (
    <div className="select-none">
      <div className="flex gap-2 items-start">
        <div className="">
          <img
            src={props.product.productImages[0].images.url}
            alt="Product"
            className="w-48 h-48 object-contain bg-white pointer-events-none"
          />
        </div>
        <div>
          <div className="flex justify-between items-end mb-2">
            <div className="flex gap-1 items-center">
              <div className="font-semibold tracking-wide text-xl flex items-center">
                <Tag
                  value={String(props.product.brand.name).toLocaleUpperCase()}
                />
                - {props.product.name}
              </div>
            </div>
            {/* <div className="text-xs tracking-wider">
              <div>{props.product.type.name}</div>
              <div>{props.product.category.name}</div>
            </div> */}
          </div>
          <div className="border-t py-4 grid grid-cols-1 gap-1 w-full justify-items-start place-items-center">
            <div className="flex gap-1 items-center">
              <div className="flex gap-1 items-center opacity-60 font-semibold">
                <Barcode className="w-5 h-5" />:
              </div>
              <div
                onClick={() =>
                  handlePropertyClick(props.product.barcodeRegister[0].barcode)
                }
                className="tracking-wider selection:bg-interface-hover cursor-pointer active:scale-90 transition-all duration-100"
              >
                {props.product.barcodeRegister[0].barcode}
              </div>
            </div>

            <div className="flex gap-1 items-center">
              <div className="flex gap-1 items-center opacity-60 font-semibold">
                <Palette className="w-5 h-5" />:
              </div>
              <div
                onClick={() =>
                  handlePropertyClick(props.product.barcodeRegister[0].color)
                }
                className="tracking-wider selection:bg-interface-hover cursor-pointer active:scale-90 transition-all duration-100"
              >
                {props.product.barcodeRegister[0].color}
              </div>
            </div>

            <div className="flex gap-1 items-center">
              <div className="flex gap-1 items-center opacity-60 font-semibold">
                <ReceiptCent className="w-5 h-5" />:
              </div>
              <div
                onClick={() =>
                  handlePropertyClick(props.product.barcodeRegister[0].cost)
                }
                className="tracking-wider selection:bg-interface-hover cursor-pointer active:scale-90 transition-all duration-100"
              >
                {props.product.barcodeRegister[0].cost}
              </div>
            </div>

            <div className="flex gap-1 items-center">
              <div className="flex gap-1 items-center opacity-60 font-semibold">
                <Receipt className="w-5 h-5" />:
              </div>
              <div
                onClick={() =>
                  handlePropertyClick(props.product.barcodeRegister[0].invoice)
                }
                className="tracking-wider selection:bg-interface-hover cursor-pointer active:scale-90 transition-all duration-100"
              >
                {props.product.barcodeRegister[0].invoice}
              </div>
            </div>

            <div className="flex gap-1 items-center text-sm italic">
              <div className="flex gap-1 items-center opacity-60">
                {/* <Palette className="w-5 h-5" />: */}
              </div>
              <div
                onClick={() => handlePropertyClick(props.product.category.name)}
                className="tracking-wider opacity-60 selection:bg-interface-hover cursor-pointer active:scale-90 transition-all duration-100"
              >
                {props.product.category.name} / {props.product.type.name}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductViewer;
