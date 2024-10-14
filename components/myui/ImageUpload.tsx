import React, { useEffect, useState } from "react";
import { CupSoda, Trash } from "lucide-react";

type ImageUploadProps = {
  multiple?: boolean;
  onImageUpload?: (images: string[]) => void;
  showSelectedImages?: boolean;
  coverImage: string;
};

const ImageUpload = ({
  multiple = false,
  onImageUpload,
  showSelectedImages,
  coverImage,
}: ImageUploadProps) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  useEffect(() => {}, [coverImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const validImages = fileArray.filter((file) =>
      ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(file.type)
    );

    if (validImages.length === 0) {
      alert("Please select a valid image file (jpg, jpeg, png, gif).");
      return;
    }

    const imagePromises = validImages.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject("Failed to read file");
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then((base64Images) => {
      const newImages = multiple
        ? [...selectedImages, ...base64Images]
        : base64Images;

      setSelectedImages(newImages);
      if (onImageUpload) {
        onImageUpload(newImages);
      }

      // if (!coverImage && newImages.length > 0) {
      //   setCoverImage(newImages[newImages.length - 1]); // Set the first image as the cover image
      // }
    });
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);

    // if (updatedImages.length > 0) {
    //   setCoverImage(updatedImages[updatedImages.length - 1]);
    // } else {
    //   setCoverImage("");
    // }

    setSelectedImages(updatedImages);
    if (onImageUpload) {
      onImageUpload(updatedImages);
    }
  };

  return (
    <div>
      <label className="group cursor-pointer drop-shadow-sm p-4 w-44 h-44 border-2 bg-white border-dashed rounded-xl flex flex-col justify-center items-center ">
        {coverImage ? (
          <div>
            <img
              src={coverImage}
              alt="Preview"
              className="w-44 h-44 object-cover"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2 items-center">
            <CupSoda className="group-hover:opacity-100 opacity-40 text-interface-secondry transition-all duration-300 pointer-events-none" />
            <div className="text-xs mt-2 font-semibold text-interface-secondry group-hover:opacity-100 opacity-40 transition-all duration-300 pointer-events-none">
              Image Upload
            </div>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={handleImageChange}
        />
      </label>

      {/* Preview Selected Images */}
      {showSelectedImages && (
        <div className="flex flex-wrap mt-4 gap-2">
          {selectedImages.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt="Preview"
                className="w-20 h-20 object-cover rounded"
              />
              <div
                className="absolute w-6 h-6 text-center flex justify-center items-center text-sm top-0 right-1 cursor-pointer"
                onClick={() => handleRemoveImage(index)}
              >
                <Trash className="fill-interface-secondry text-interface-secondry bg-white rounded-full p-1 border border-interface-secondry" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
