import InputBox from "@/components/myui/InputBox";
import React from "react";

type Props = {};

const BrandForm = (props: Props) => {
  return (
    <div className="p-2 min-w-[370px]">
      <div>
        <InputBox label="Name" />
        <div className="grid grid-cols-2 gap-2">
          <InputBox label="Phone #1" />
          <InputBox label="Phone #2" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <InputBox label="Address #1" />
          <InputBox label="Address #2" />
        </div>
        <InputBox label="Description" />
      </div>
    </div>
  );
};

export default BrandForm;
