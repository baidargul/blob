"use client";
import ImageUpload from "@/components/myui/ImageUpload";
import InputBox from "@/components/myui/InputBox";
import { Trash } from "lucide-react";
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

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
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
      <div className="mt-2">
        <div className="flex flex-wrap gap-2">
          {images.map((image: string, index: number) => (
            <div key={index} className="relative group">
              <div
                onClick={() => handleRemoveImage(index)}
                className="absolute w-6 h-6 text-center flex justify-center items-center text-sm top-2 right-2 cursor-pointer"
              >
                <Trash className="fill-interface-secondry text-interface-secondry bg-white rounded-full p-1 border border-interface-secondry group-hover:block hidden" />
              </div>
              <img
                src={image}
                className="w-44 h-44 object-cover border rounded-xl"
                alt={`Image ${index + 1}`}
                key={index}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
