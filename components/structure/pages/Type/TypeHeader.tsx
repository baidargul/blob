import Button from "@/components/myui/Button";
import { serverActions } from "@/serverActions/serverActions";
import { category, type } from "@prisma/client";
import React from "react";
import { toast } from "sonner";

type Props = {
  type: type | null | any;
  saveType: (name: string, category: string, description: string) => void;
  createType: () => void;
  fetchTypes: () => void;
  fetchCategories: () => void;
  isReadOnly: boolean;
};

const TypeHeader = (props: Props) => {
  const handleSave = async () => {
    if (props.type) {
      if (props.type) {
        props.saveType(
          props.type.name,
          props.type.categoryId,
          props.type.description
        );
      }
    }
  };

  const handleCreateNewType = () => {
    props.createType();
  };

  const handleRemove = async () => {
    const response = await serverActions.Type.remove(props.type.id);
    if (response.status === 200) {
      props.createType();
      props.fetchTypes();
      props.fetchCategories();
    } else if (response.status === 400) {
      toast.warning(response.message);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="p-2 rounded">
      <div className="flex justify-end items-center gap-2">
        {props.type?.createdAt?.length > 0 && (
          <Button onClick={handleCreateNewType} variant="primary">
            Create new category
          </Button>
        )}
        {!props.type?.createdAt?.length && (
          <Button onClick={handleSave} variant="secondary">
            Save
          </Button>
        )}
        {props.type?.createdAt?.length > 0 && (
          <Button onClick={handleRemove} variant="secondary">
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};

export default TypeHeader;
