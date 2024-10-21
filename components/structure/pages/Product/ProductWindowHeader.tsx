import Button from "@/components/myui/Button";
import { Product } from "@/serverActions/partials/product";
import { serverActions } from "@/serverActions/serverActions";
import { brand, category, type } from "@prisma/client";
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
  brand: brand | null | any;
  category: category | null | any;
  type: type | null | any;
  saveProduct?: (
    name: string,
    cost: number,
    price: number,
    images: string[],
    brand: brand | null | any,
    category: category | null | any,
    type: type | null | any
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
          props.product.images || [],
          props.brand,
          props.category,
          props.type
        );
      }
    }
  };

  const handleCreateNewProduct = () => {
    props.createProduct();
  };

  const handleRemove = async () => {
    const response = await serverActions.Product.remove(props.product.id);
    if (response.status === 200) {
      props.createProduct();
      props.fetchProducts();
    }
  };

  return (
    <div className="p-2 rounded">
      <div className="flex justify-end items-center gap-2">
        {props.product?.createdAt?.length > 0 && (
          <Button onClick={handleCreateNewProduct} variant="primary">
            Create new product
          </Button>
        )}
        {!props.product?.createdAt?.length && (
          <Button onClick={handleSave} variant="secondary">
            Save
          </Button>
        )}
        {props.product?.createdAt?.length > 0 && (
          <Button onClick={handleRemove} variant="secondary">
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductWindowHeader;
