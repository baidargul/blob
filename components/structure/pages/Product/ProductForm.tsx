"use client";
import InputBox from "@/components/myui/InputBox";
import React, { useState } from "react";

type Props = {};

const ProductForm = (props: Props) => {
  const [name, setName] = useState("");
  const [cost, setCost] = useState(0);
  const [price, setPrice] = useState(0);

  const handleNameChange = (value: string | number) => {
    setName(String(value));
  };

  const handleCostChange = (value: string | number) => {
    setCost(Number(value));
  };

  const handlePriceChange = (value: string | number) => {
    setPrice(Number(value));
  };

  return (
    <div>
      <InputBox label="Name:" setValue={handleNameChange} value={name} />
      <InputBox
        label="Cost:"
        setValue={handleCostChange}
        value={cost}
        type="number"
      />
      <InputBox
        label="Price:"
        setValue={handlePriceChange}
        value={price}
        type="number"
      />
    </div>
  );
};

export default ProductForm;
