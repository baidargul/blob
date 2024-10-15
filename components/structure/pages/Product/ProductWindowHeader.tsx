import Button from "@/components/myui/Button";
import React from "react";

type Props = {};

const ProductWindowHeader = (props: Props) => {
  return (
    <div className="p-2 rounded">
      <div className="flex justify-end items-center gap-2">
        <Button variant="primary">Create new product</Button>
        <Button variant="secondary">Save</Button>
      </div>
    </div>
  );
};

export default ProductWindowHeader;
