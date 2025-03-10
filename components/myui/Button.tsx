import React from "react";

type Props = {
  children?: React.ReactNode;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  className?: string;
  isBusy?: boolean;
  onClick?: any;
};

const Button = (props: Props) => {
  const primary =
    "hover:bg-interface-hover bg-interface-hover/70 border border-interface-hover";
  const secondary =
    "hover:bg-interface-hover text-interface-text border border-interface-hover";

  let style = "";

  switch (props.variant) {
    case "primary":
      style = primary;
      break;
    case "secondary":
      style = secondary;
      break;
    default:
      style = primary;
      break;
  }

  return (
    <div
      onClick={props.onClick ? props.onClick : null}
      className={`py-2 px-4 tracking-wide rounded transition-all duration-500 ${style} ${
        props.className
      } ${props.isBusy && "cursor-not-allowed animate-pulse"} ${
        props.disabled && props.disabled === true
          ? "opacity-40 cursor-not-allowed"
          : "opacity-100 cursor-pointer"
      }`}
    >
      {props.children ? props.children : "Button"}
    </div>
  );
};

export default Button;
