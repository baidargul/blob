import InputBox from "@/components/myui/InputBox";
import { brand } from "@prisma/client";
import { useEffect, useState } from "react";

type Props = {
  selectedBrand?: brand | null | any;
  setBrand: (brand: brand) => void;
};

const BrandForm = (props: Props) => {
  const [name, setName] = useState<string>("");
  const [phone1, setPhone1] = useState<string>("");
  const [phone2, setPhone2] = useState<string>("");
  const [address1, setAddress1] = useState<string>("");
  const [address2, setAddress2] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (props.selectedBrand) {
      setName(props.selectedBrand.name);
      setPhone1(props.selectedBrand.phone1);
      setPhone2(props.selectedBrand.phone2);
      setAddress1(props.selectedBrand.address1);
      setAddress2(props.selectedBrand.address2);
      setDescription(props.selectedBrand.description);
    }
  }, [props.selectedBrand]);

  const handleNameChange = (value: string) => {
    setName(value);

    const temp: brand = {
      id: "",
      name: value,
      phone1,
      phone2,
      address1,
      address2,
      description,
      createdAt: null,
      updatedAt: null,
    };

    props.setBrand({ ...temp });
  };

  const handlePhone1Change = (value: string) => {
    setPhone1(value);
    const temp: brand = {
      id: "",
      name,
      phone1: value,
      phone2,
      address1,
      address2,
      description,
      createdAt: null,
      updatedAt: null,
    };

    props.setBrand({ ...temp });
  };

  const handlePhone2Change = (value: string) => {
    setPhone2(value);
    const temp: brand = {
      id: "",
      name,
      phone1,
      phone2: value,
      address1,
      address2,
      description,
      createdAt: null,
      updatedAt: null,
    };

    props.setBrand({ ...temp });
  };

  const handleAddress1Change = (value: string) => {
    setAddress1(value);
    const temp: brand = {
      id: "",
      name,
      phone1,
      phone2,
      address1: value,
      address2,
      description,
      createdAt: null,
      updatedAt: null,
    };

    props.setBrand({ ...temp });
  };

  const handleAddress2Change = (value: string) => {
    setAddress2(value);
    const temp: brand = {
      id: "",
      name,
      phone1,
      phone2,
      address1,
      address2: value,
      description,
      createdAt: null,
      updatedAt: null,
    };

    props.setBrand({ ...temp });
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    const temp: brand = {
      id: "",
      name,
      phone1,
      phone2,
      address1,
      address2,
      description: value,
      createdAt: null,
      updatedAt: null,
    };

    props.setBrand({ ...temp });
  };

  return (
    <div className="p-2 min-w-[370px]">
      <div>
        <InputBox label="Name" setValue={handleNameChange} value={name} />
        <div className="grid grid-cols-2 gap-2">
          <InputBox
            label="Phone #1"
            setValue={handlePhone1Change}
            value={phone1}
          />
          <InputBox
            label="Phone #2"
            setValue={handlePhone2Change}
            value={phone2}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <InputBox
            label="Address #1"
            setValue={handleAddress1Change}
            value={address1}
          />
          <InputBox
            label="Address #2"
            setValue={handleAddress2Change}
            value={address2}
          />
        </div>
        <InputBox
          label="Description"
          setValue={handleDescriptionChange}
          value={description}
        />
      </div>
    </div>
  );
};

export default BrandForm;
