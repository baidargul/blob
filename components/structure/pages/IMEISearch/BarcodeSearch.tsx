"use client";
import InputBox from "@/components/myui/InputBox";
import Label from "@/components/myui/Label";
import { SERVER_RESPONSE } from "@/serverActions/internal/server";
import { serverActions } from "@/serverActions/serverActions";
import React, { useState } from "react";

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

type Props = {};

const BarcodeSearch = (props: Props) => {
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState<Product | null | any>(null);

  const fetchProduct = async () => {
    const response: SERVER_RESPONSE =
      await serverActions.Inventory.getByBarcode(barcode);
    if (response.status === 200) {
      setProduct(response.data);
    } else {
      setProduct(null);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      fetchProduct();
    }
  };

  return (
    <div className="p-2 w-full text-interface-text">
      <div className="my-2">
        <Label label="Search by Barcode" size="text-lg" />
      </div>
      <div className="my-2 border-b-2 py-2">
        <div>
          <InputBox
            placeholder="Search by Barcode"
            setValue={setBarcode}
            value={barcode}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      {product && product.id && (
        <div className="flex gap-4 items-start mt-4">
          <div className="rounded-md w-fit">
            <img
              src={product.productImages[0].images.url}
              alt={product.name}
              className="w-52 h-52 bg-white border pointer-events-none rounded-md object-contain"
            />
          </div>
          <div className="">
            <div className="text-2xl font-semibold ">{product.name}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeSearch;
