import {
  Combobox,
  ComboBox_ADD_VALUE_TO_EACH_OPTION,
} from "@/components/myui/ComboBox";
import InputBox from "@/components/myui/InputBox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { serverActions } from "@/serverActions/serverActions";
import { product } from "@prisma/client";
import React, { useEffect, useState } from "react";

type Props = {};

const PurchaseProductForm = (props: Props) => {
  const [productList, setProductList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [color, setColor] = useState("");
  const [invoice, setInvoice] = useState(0);
  const [cost, setCost] = useState(0);
  const [difference, setDifference] = useState(0);
  const [barcode, setBarcode] = useState("");

  const fetchProducts = async () => {
    const response = await serverActions.Product.listAll();
    response.data = ComboBox_ADD_VALUE_TO_EACH_OPTION(response.data);
    setProductList((prev: any) => response.data);
  };
  const calculateDifference = (c: number, i: number) => {
    let temp: any = c / i;
    temp = temp * 100;
    temp = 100 - temp;
    temp = temp;
    setDifference((prev: any) => temp);
  };

  const handleProductSelect = (p: product | any) => {
    setSelectedProduct(p);
  };

  const handleColorChange = (e: any) => {
    setColor(e);
  };

  const handleInvoiceChange = (e: any) => {
    setInvoice((prev: any) => e);
    calculateDifference(cost, e);
  };

  const handleCostChange = (e: any) => {
    setCost((prev: any) => e);
    calculateDifference(e, invoice);
  };

  const handleBarcodeChange = (e: any) => {
    setBarcode(e);
  };

  const handleBarcodeKeyPress = (e: any) => {};

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div>
        <Combobox
          options={productList}
          label="Select Product"
          setValue={handleProductSelect}
        />
      </div>
      <div>
        <ScrollArea className="h-[70dvh] border rounded w-full p-2">
          <div className="flex flex-col gap-2">
            <div>
              <InputBox
                label="Color"
                setValue={handleColorChange}
                value={color}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <InputBox
                label="Invoice"
                setValue={handleInvoiceChange}
                value={invoice}
              />
              <InputBox label="Cost" setValue={handleCostChange} value={cost} />
              <InputBox
                label="Difference %"
                readonly
                value={isNaN(difference) ? 0 : difference}
              />
            </div>
            <div>
              <InputBox
                label="Barcode"
                setValue={handleBarcodeChange}
                value={barcode}
              />
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default PurchaseProductForm;
