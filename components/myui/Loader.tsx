import React from "react";
import Spinner from "./Spinner";

type Props = {};

const Loader = (props: Props) => {
  return (
    <div className="w-full h-full inset-0 absolute z-30 flex justify-center items-center text-center cursor-not-allowed">
      <Spinner />
      <div className="inset-0 w-full h-full absolute z-50 bg-black/5 backdrop-blur-[1px] rounded-md"></div>
    </div>
  );
};

export default Loader;
