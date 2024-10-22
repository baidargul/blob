import Button from "@/components/myui/Button";
import { Product } from "@/serverActions/partials/product";
import { serverActions } from "@/serverActions/serverActions";
import { brand, category, type } from "@prisma/client";
import React from "react";

type Props = {
  brand: brand | null | any;
  saveBrand: (
    name: string,
    phone1: string,
    phone2: string,
    address1: string,
    address2: string,
    description: string
  ) => void;
  createBrand: () => void;
  fetchBrands: () => void;
  isReadOnly: boolean;
};

const BrandHeader = (props: Props) => {
  const handleSave = async () => {
    if (props.brand) {
      if (props.brand) {
        props.saveBrand(
          props.brand.name,
          props.brand.phone1,
          props.brand.phone2,
          props.brand.address1,
          props.brand.address2,
          props.brand.description
        );
      }
    }
  };

  const handleCreateNewProduct = () => {
    props.createBrand();
  };

  const handleRemove = async () => {
    const response = await serverActions.Brand.remove(props.brand.id);
    if (response.status === 200) {
      props.createBrand();
      props.fetchBrands();
    }
  };

  return (
    <div className="p-2 rounded">
      <div className="flex justify-end items-center gap-2">
        {props.brand?.createdAt?.length > 0 && (
          <Button onClick={handleCreateNewProduct} variant="primary">
            Create new brand
          </Button>
        )}
        {!props.brand?.createdAt?.length && (
          <Button onClick={handleSave} variant="secondary">
            Save
          </Button>
        )}
        {props.brand?.createdAt?.length > 0 && (
          <Button onClick={handleRemove} variant="secondary">
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};

export default BrandHeader;
