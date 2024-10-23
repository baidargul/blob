import {
  Combobox,
  ComboBox_ADD_VALUE_TO_EACH_OPTION,
} from "@/components/myui/ComboBox";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    <div className="flex flex-col gap-2">
      <div>
        <Combobox options={productList} label="Select Product" />
      </div>
      <div>
        <ScrollArea className="h-[70dvh] border rounded w-full p-2"></ScrollArea>
      </div>
    </div>
  );
};

export default PurchaseProductForm;
