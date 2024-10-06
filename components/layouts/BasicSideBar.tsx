import React from "react";

type Props = {
  sidebar?: React.ReactNode;
  content?: React.ReactNode;
};

const BasicSideBar = (props: Props) => {
  return (
    <div className="w-full bg-zinc-200 min-h-[100dvh] p-2">
      <div className="w-full grid grid-cols-[auto_1fr] gap-2">
        <div className="w-full h-[95dvh] bg-zinc-100 p-2 rounded-md">
          {props.sidebar}
        </div>
        <div className="w-full h-[95dvh] bg-zinc-100 p-2 rounded-md">
          {props.content}
        </div>
      </div>
    </div>
  );
};

export default BasicSideBar;
