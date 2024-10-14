import React, { useState } from "react";
import { CupSoda, Trash } from "lucide-react";

type ImageUploadProps = {
  multiple?: boolean; // Prop to toggle between single or multiple file selection
  onImageUpload?: (images: string[]) => void; // Callback to pass image data to parent component
  showSelectedImages?: boolean;
};

const ImageUpload = ({
  multiple = false,
  onImageUpload,
  showSelectedImages,
}: ImageUploadProps) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  // Function to handle file selection and convert to base64
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

    // Convert images to base64 and store them
    const imagePromises = validImages.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject("Failed to read file");
        reader.readAsDataURL(file); // Convert to Base64
      });
    });

    Promise.all(imagePromises).then((base64Images) => {
      if (multiple) {
        setSelectedImages(base64Images); // Store multiple images
        if (onImageUpload) {
          onImageUpload(base64Images); // Send to parent component
        }
      } else {
        // setSelectedImages([base64Images[0]]); // Only store the first image for single mode
        // if (onImageUpload) {
        //   onImageUpload(base64Images[0]); // Send single image to parent
        // }
        setSelectedImages(base64Images); // Store multiple images
        if (onImageUpload) {
          onImageUpload(base64Images); // Send to parent component
        }
      }
    });
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
    if (onImageUpload) {
      onImageUpload(updatedImages);
    }
  };

  return (
    <div>
      <label className="group cursor-pointer drop-shadow-sm p-4 w-44 h-44 border-2 bg-white border-dashed rounded-xl flex flex-col justify-center items-center ">
        <CupSoda className="group-hover:opacity-100 opacity-40 text-interface-secondry transition-all duration-300 pointer-events-none" />
        <div className="text-xs mt-2 font-semibold text-interface-secondry group-hover:opacity-100 opacity-40 transition-all duration-300 pointer-events-none">
          Image Upload
        </div>
        <input
          type="file"
          accept="image/*"
          multiple={multiple} // Allows single or multiple file selection
          className="hidden"
          onChange={handleImageChange}
        />
      </label>

      {/* Preview Selected Images */}
      {showSelectedImages && showSelectedImages === true && (
        <div className="flex flex-wrap mt-4 gap-2">
          {selectedImages.length > 0 &&
            selectedImages.map((image, index) => (
              <div
                key={index}
                className="relative"
                onClick={() => handleRemoveImage(index)}
              >
                <img
                  key={index}
                  src={image}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="absolute w-6 h-6 text-center flex justify-center items-center text-sm top-0 right-1 cursor-pointer">
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
