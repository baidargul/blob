import {
  Combobox,
  ComboBox_ADD_VALUE_TO_EACH_OPTION,
} from "@/components/myui/ComboBox";
import { serverActions } from "@/serverActions/serverActions";
import React, { useEffect, useState } from "react";

type Props = {};

const PurchaseProductForm = (props: Props) => {
  const [productList, setProductList] = useState([]);

  const fetchProducts = async () => {
    const response = await serverActions.Product.listAll();
    response.data = ComboBox_ADD_VALUE_TO_EACH_OPTION(response.data);
    setProductList((prev: any) => response.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <div>
        <Combobox options={productList} label="Select Product" />
      </div>
    </div>
  );
};

export default PurchaseProductForm;
