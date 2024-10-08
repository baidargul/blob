import React from "react";

type Props = {
  label: string;
  size?: "text-xs" | "text-sm" | "text-md" | "text-lg";
};

const Label = (props: Props) => {
  return (
    <div
      className={`${
        props.size ? props.size : "text-base"
      } font-semibold text-interface-text/80`}
    >
      {props.label}
    </div>
  );
};

export default Label;
