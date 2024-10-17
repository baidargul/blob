import Button from "@/components/myui/Button";
import { product } from "@prisma/client";
import React from "react";

type Props = {
  product:
    | {
        name: string;
        cost: number;
        price: number;
        images: string[];
      }
    | null
    | any;
  saveProduct?: (
    name: string,
    cost: number,
    price: number,
    images: string[]
  ) => void;
  createProduct: () => void;
};

const ProductWindowHeader = (props: Props) => {
  const handleSave = async () => {
    if (props.saveProduct) {
      if (props.product) {
        props.saveProduct(
          props.product.name,
          Number(props.product.cost),
          Number(props.product.price),
          props.product.images || []
        );
      }
    }
  };

  const handleCreateNewProduct = () => {
    props.createProduct();
  };

  return (
    <div className="p-2 rounded">
      <div className="flex justify-end items-center gap-2">
        <Button onClick={handleCreateNewProduct} variant="primary">
          Create new product
        </Button>
        <Button onClick={handleSave} variant="secondary">
          Save
        </Button>
      </div>
    </div>
  );
};

export default ProductWindowHeader;
