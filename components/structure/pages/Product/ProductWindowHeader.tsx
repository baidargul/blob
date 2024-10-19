import Button from "@/components/myui/Button";
import { product } from "@/serverActions/partials/product";
import { serverActions } from "@/serverActions/serverActions";
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
  fetchProducts: () => void;
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

  const handleRemove = async () => {
    const response = await serverActions.product.remove(props.product.id);
    // const response = await serverActions.product.removeAll();
    if (response.status === 200) {
      props.createProduct();
      props.fetchProducts();
    }
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
        <Button onClick={handleRemove} variant="secondary">
          Remove
        </Button>
      </div>
    </div>
  );
};

export default ProductWindowHeader;
