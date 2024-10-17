"use client";
import AccordionProvider from "@/components/myui/AccordionProvider";
import ImageUpload from "@/components/myui/ImageUpload";
import InputBox from "@/components/myui/InputBox";
import Label from "@/components/myui/Label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { product } from "@prisma/client";
import { Trash } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  product: product | null | any;
  setProduct: any;
};

const ProductForm = (props: Props) => {
  const [coverImage, setCoverImage] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [cost, setCost] = useState(0);
  const [price, setPrice] = useState(0);
  const txtNameRef: any = useRef(null);

  useEffect(() => {
    if (props.product) {
      setName(props.product.name);
      setCost(props.product.cost);
      setPrice(props.product.price);
      setImages(props.product.images);
      if (props.product?.images?.length > 0) {
        setCoverImage(props.product.images[0]);
      } else {
        setCoverImage("");
      }

      if (txtNameRef.current) {
        txtNameRef.current.select();
      }
    }
  }, [props.product]);

  const handleNameChange = (value: string | number) => {
    setName(String(value));
    const temp = {
      name: String(value),
      images,
      cost,
      price,
    };

    props.setProduct({ ...temp });
  };

  const handleCostChange = (value: string | number) => {
    setCost(Number(value));

    const temp = {
      name,
      images,
      cost: Number(value),
      price,
    };

    props.setProduct({ ...temp });
  };

  const handlePriceChange = (value: string | number) => {
    setPrice(Number(value));

    const temp = {
      name,
      images,
      cost,
      price: Number(value),
    };

    props.setProduct({ ...temp });
  };

  const handleImageUpload = (value: string[]) => {
    setImages(value);
    if (value.length > 0) {
      const lastImage = value[value.length - 1];
      setCoverImage(lastImage);

      const temp = {
        name,
        images: value,
        cost,
        price,
      };

      props.setProduct({ ...temp });
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

    const temp = {
      name,
      images: updatedImages,
      cost,
      price,
    };

    props.setProduct({ ...temp });
  };

  return (
    <div>
      <div className="flex gap-2 items-start w-full">
        <ImageUpload
          multiple
          onImageUpload={handleImageUpload}
          coverImage={coverImage}
          images={images}
        />
        <div className="w-full">
          <InputBox
            ref={txtNameRef}
            label="Name:"
            setValue={handleNameChange}
            value={name}
          />
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
      {images && images.length > 0 && (
        <AccordionProvider content={AcordionContent(images, handleRemoveImage)}>
          <Label label={`Media (${images.length})`} size="text-sm" />
        </AccordionProvider>
      )}
    </div>
  );
};

export default ProductForm;

const AcordionContent = (
  images: string[],
  handleRemoveImage: (index: number) => any
) => {
  return (
    <div className="mt-2">
      <div className="w-full max-h-[400px] p-2 bg-zinc-200 rounded overflow-y-auto">
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
      </div>
    </div>
  );
};
