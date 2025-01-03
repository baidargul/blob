import Button from "@/components/myui/Button";
import {
  Combobox,
  ComboBox_ADD_VALUE_TO_EACH_OPTION,
} from "@/components/myui/ComboBox";
import InputBox from "@/components/myui/InputBox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { serverActions } from "@/serverActions/serverActions";
import { product, purchase, vendor } from "@prisma/client";
import React, { useEffect, useState } from "react";

type Props = {
  purchaseOrder: purchase | null;
  productList: product[] | null;
  setProductList: any;
  handleAddToCart: any;
  vendorList: vendor[];
  setSelectedVendor: any;
  selectedVendor: vendor | null;
};

const PurchaseProductForm = (props: Props) => {
  const [productList, setProductList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState<product | null>(null);
  const [color, setColor] = useState("");
  const [invoice, setInvoice] = useState(0);
  const [cost, setCost] = useState(0);
  const [difference, setDifference] = useState(0);
  const [barcode, setBarcode] = useState("");

  const handleAddToCart = async () => {
    if (selectedProduct && selectedProduct.name?.length > 0) {
      if (barcode.length < 1) {
        alert("Barcode is required");
        return;
      }

      if (props.handleAddToCart) {
        props.handleAddToCart(
          selectedProduct.id,
          color,
          cost,
          invoice,
          barcode
        );
        setBarcode("");
      }
    }
  };

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
    if (p.cost) {
      setCost((prev: any) => p.cost);
    }

    if (p.price) {
      setInvoice((prev: any) => p.price);
    }

    calculateDifference(p.cost, p.price);
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

  const handleBarcodeKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey && e.key === " ") {
      let temp: any = Math.random();
      temp = temp.toString(16);
      temp = `${temp.slice(2, 10)}${Math.random().toFixed(
        0
      )}${new Date().getMinutes()}${new Date().getSeconds()}${new Date().getMilliseconds()}${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDate()}`;
      //Get first 15 characters
      temp = temp.slice(0, 15);
      setBarcode(String(temp).toLocaleUpperCase());
    } else if (e.key === "Enter") {
      handleAddToCart();
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="mb-2 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <InputBox
            label="Order #"
            readonly
            value={
              props.purchaseOrder ? `PO-${props.purchaseOrder.orderNo}` : ""
            }
          />
          <InputBox
            label="Date"
            readonly
            value={
              props.purchaseOrder && props.purchaseOrder.purchaseDate
                ? new Date(props.purchaseOrder.purchaseDate).toDateString()
                : ""
            }
          />
        </div>
        <Combobox
          options={props.vendorList}
          label="Select Vendor"
          setValue={props.setSelectedVendor}
          value={props.selectedVendor ? props.selectedVendor.name : null}
        />
      </div>
      <div>
        <Combobox
          options={productList}
          label="Select Product"
          setValue={handleProductSelect}
        />
      </div>
      <div>
        {/* <ScrollArea className="h-[43dvh] border rounded w-full p-2"> */}
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
          <div className="flex gap-2 items-end">
            <div className="w-full">
              <InputBox
                label="Barcode"
                setValue={handleBarcodeChange}
                onKeyDown={handleBarcodeKeyPress}
                value={barcode}
                maxLength={15}
                placeholder="Press Ctrl+Space to generate barcode"
              />
            </div>
            <Button
              onClick={handleAddToCart}
              className="h-9 w-20 text-center text-sm ml-auto"
            >
              Add
            </Button>
          </div>
        </div>
        {/* </ScrollArea> */}
      </div>
    </div>
  );
};

export default PurchaseProductForm;
