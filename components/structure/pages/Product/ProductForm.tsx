"use client";
import ImageUpload from "@/components/myui/ImageUpload";
import InputBox from "@/components/myui/InputBox";
import React, { useState } from "react";

type Props = {};

const ProductForm = (props: Props) => {
  const [images, setImages] = useState<string[]>([]);
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
      <div className="flex gap-2 items-start w-full">
        <ImageUpload multiple onImageUpload={setImages} />
        <div className="w-full">
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
      </div>
      <div>
        <div>
          {images.map((image: string, index: number) => (
            <img src={image} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
