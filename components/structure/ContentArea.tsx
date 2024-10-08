import React from "react";
import ProductList from "./pages/Product/List";

type Props = {};

const ContentArea = (props: Props) => {
  return (
    <div>
      <div>
        <ProductList />
      </div>
    </div>
  );
};

export default ContentArea;
