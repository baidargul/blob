import {
  Combobox,
  ComboBox_ADD_VALUE_TO_EACH_OPTION,
} from "@/components/myui/ComboBox";
import InputBox from "@/components/myui/InputBox";
import { category, type } from "@prisma/client";
import { useEffect, useState } from "react";

type Props = {
  selectedType?: type | null | any;
  setType: (type: type | any) => void;
  categoryList: category[];
  isReadOnly: boolean;
};

const TypeForm = (props: Props) => {
  const [name, setName] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<category | null>(
    null
  );
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (props.selectedType) {
      setName(props.selectedType.name);
      setDescription(props.selectedType.description);
      setSelectedCategory(props.selectedType.category);
    }
  }, [props.selectedType]);

  const handleNameChange = (value: string) => {
    setName(value);

    const temp: type = {
      id: "",
      name: value,
      description,
      createdAt: null,
      updatedAt: null,
      categoryId: "",
    };

    props.setType({ ...temp });
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    const temp: type = {
      id: "",
      name,
      description: value,
      createdAt: null,
      updatedAt: null,
      categoryId: "",
    };

    props.setType({ ...temp });
  };

  const handleCategoryChange = (value: any) => {
    const temp: type = {
      id: "",
      name,
      description,
      createdAt: null,
      updatedAt: null,
      categoryId: value.id,
    };

    props.setType({ ...temp });
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
        <Combobox
          options={props.categoryList}
          label="Category"
          setValue={handleCategoryChange}
          disabled={props.isReadOnly}
          value={selectedCategory?.name}
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

export default TypeForm;
