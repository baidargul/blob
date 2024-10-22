import InputBox from "@/components/myui/InputBox";
import { brand, category, type } from "@prisma/client";
import { useEffect, useState } from "react";

type Props = {
  selectedType?: type | null | any;
  setType: (type: type) => void;
  isReadOnly: boolean;
};

const TypeForm = (props: Props) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (props.selectedType) {
      setName(props.selectedType.name);
      setDescription(props.selectedType.description);
    }
  }, [props.selectedType]);

  const handleNameChange = (value: string) => {
    setName(value);

    const temp: category = {
      id: "",
      name: value,
      description,
      createdAt: null,
      updatedAt: null,
    };

    props.setType({ ...temp });
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
