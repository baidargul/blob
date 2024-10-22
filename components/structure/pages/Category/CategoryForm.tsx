import InputBox from "@/components/myui/InputBox";
import { brand, category } from "@prisma/client";
import { useEffect, useState } from "react";

type Props = {
  selectedCategory?: category | null | any;
  setCategory: (category: category) => void;
  isReadOnly: boolean;
};

const CategoryForm = (props: Props) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (props.selectedCategory) {
      setName(props.selectedCategory.name);
      setDescription(props.selectedCategory.description);
    }
  }, [props.selectedCategory]);

  const handleNameChange = (value: string) => {
    setName(value);

    const temp: category = {
      id: "",
      name: value,
      description,
      createdAt: null,
      updatedAt: null,
    };

    props.setCategory({ ...temp });
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    const temp: category = {
      id: "",
      name,
      description: value,
      createdAt: null,
      updatedAt: null,
    };

    props.setCategory({ ...temp });
  };

  return (
    <div className="p-2 min-w-[370px]">
      <div>
        <InputBox
          label="Name"
          setValue={handleNameChange}
          value={name}
          readonly={props.isReadOnly}
        />
        <InputBox
          label="Description"
          setValue={handleDescriptionChange}
          value={description}
          readonly={props.isReadOnly}
        />
      </div>
    </div>
  );
};

export default CategoryForm;
