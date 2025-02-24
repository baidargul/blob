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
      props.setValue(props.product);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={` text-sm p-2 grid grid-cols-2 w-full gap-2  ${
        props.isSelected
          ? "bg-interface-primary/60 "
          : "hover:bg-interface-primary/10 even:bg-interface-accent/10"
      }`}
    >
      <div>{props.value}</div>
      <div>{props.product.category.name}</div>
    </div>
  );
};

export default ListRow;
