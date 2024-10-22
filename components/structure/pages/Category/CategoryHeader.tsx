import Button from "@/components/myui/Button";
import { Product } from "@/serverActions/partials/product";
import { serverActions } from "@/serverActions/serverActions";
import { brand, category, type } from "@prisma/client";
import React from "react";

type Props = {
  category: category | null | any;
  saveCategory: (name: string, description: string) => void;
  createCategory: () => void;
  fetchCategories: () => void;
  isReadOnly: boolean;
};

const CategoryHeader = (props: Props) => {
  const handleSave = async () => {
    if (props.category) {
      if (props.category) {
        props.saveCategory(props.category.name, props.category.description);
      }
    }
  };

  const handleCreateNewProduct = () => {
    props.createCategory();
  };

  const handleRemove = async () => {
    const response = await serverActions.Brand.remove(props.category.id);
    if (response.status === 200) {
      props.createCategory();
      props.fetchCategories();
    }
  };

  return (
    <div className="p-2 rounded">
      <div className="flex justify-end items-center gap-2">
        {props.category?.createdAt?.length > 0 && (
          <Button onClick={handleCreateNewProduct} variant="primary">
            Create new category
          </Button>
        )}
        {!props.category?.createdAt?.length && (
          <Button onClick={handleSave} variant="secondary">
            Save
          </Button>
        )}
        {props.category?.createdAt?.length > 0 && (
          <Button onClick={handleRemove} variant="secondary">
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};

export default CategoryHeader;
