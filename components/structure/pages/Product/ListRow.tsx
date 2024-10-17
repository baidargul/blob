import React from "react";

type Props = {
  value: string;
  product?: any;
  isSelected?: boolean;
  setValue?: (value: any) => void;
};

const ListRow = (props: Props) => {
  const handleClick = () => {
    if (props.setValue) {
      props.setValue(props.value);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={` text-sm p-1 px-2  ${
        props.isSelected
          ? "bg-interface-primary/60 "
          : "hover:bg-interface-primary/10 even:bg-interface-accent/10"
      }`}
    >
      {props.value}
    </div>
  );
};

export default ListRow;
