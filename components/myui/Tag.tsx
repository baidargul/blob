import React from "react";

type Props = {
  value: string;
};

const Tag = (props: Props) => {
  return (
    <span className="text-xs -ml-1 lg:ml-0 p-1 bg-interface-secondry/30 lg:rounded-md scale-90 lg:px-2">
      {` ${props.value}`}
    </span>
  );
};

export default Tag;
