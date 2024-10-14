"use client";
import ImageUpload from "@/components/myui/ImageUpload";
import InputBox from "@/components/myui/InputBox";
import Label from "@/components/myui/Label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash } from "lucide-react";
import React, { useState } from "react";

type Props = {};

const ProductForm = (props: Props) => {
  const [coverImage, setCoverImage] = useState("");
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

  const handleImageUpload = (value: string[]) => {
    setImages(value);
    if (value.length > 0) {
      const lastImage = value[value.length - 1];
      setCoverImage(lastImage);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    if (updatedImages.length > 0) {
      setCoverImage(updatedImages[updatedImages.length - 1]);
    } else {
      setCoverImage("");
    }
    setImages(updatedImages);
  };

  return (
    <div>
      <div className="flex gap-2 items-start w-full">
        <ImageUpload
          multiple
          onImageUpload={handleImageUpload}
          coverImage={coverImage}
        />
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
      {images.length > 0 && (
        <div className="mt-2">
          <Label label="Images:" />
          <ScrollArea className="w-full max-h-[400px] p-2 bg-zinc-200 rounded">
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
                    className="w-44 h-44 object-cover rounded-xl opacity-70 border-2 border-white group-hover:opacity-100 transition-all duration-300"
                    alt={`Image ${index + 1}`}
                    key={index}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default ProductForm;
