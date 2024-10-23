import {
  Combobox,
  ComboBox_ADD_VALUE_TO_EACH_OPTION,
} from "@/components/myui/ComboBox";
import InputBox from "@/components/myui/InputBox";
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
        <ScrollArea className="h-[70dvh] border rounded w-full p-2">
          <div className="flex flex-col gap-2">
            <div>
              <InputBox label="Color" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <InputBox label="Invoice" />
              <InputBox label="Cost" />
              <InputBox label="Difference %" readonly />
            </div>
            <div>
              <InputBox label="Barcode" />
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default PurchaseProductForm;
