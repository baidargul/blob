"use client";
import Button from "@/components/myui/Button";
import {
  Combobox,
  ComboBox_ADD_VALUE_TO_EACH_OPTION,
} from "@/components/myui/ComboBox";
import InputBox from "@/components/myui/InputBox";
import InputBoxSearch from "@/components/myui/InputBoxSearch";
import Label from "@/components/myui/Label";
import Loader from "@/components/myui/Loader";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formalizeText, formatCurrency } from "@/lib/utils";
import { serverActions } from "@/serverActions/serverActions";
import { customer, product, sale } from "@prisma/client";
import {
  Check,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import ProductOrderRow from "./ProductOrderRow";
import { toast } from "sonner";

type Props = {};

const SaleOrder = (props: Props) => {
  const [saleOrder, setSaleOrder] = useState<sale | null>(null);
  const [searchProductText, setSearchProductText] = useState<string>("");
  const [searchCustomerText, setSearchCustomerText] = useState<string>("");
  const [isWorking, setIsWorking] = useState(false);
  const [productList, setProductList] = useState<product[] | any[]>([]);
  const [cartItems, setCartItems] = useState<product[] | any[]>([]);
  const [cartSearchText, setCartSearchText] = useState<string>("");
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [customerAccount, setCustomerAccount] = useState<any | null>(null);
  const [paidAmount, setPaidAmount] = useState<number>(0);

  const handlePaidAmount = (value: number) => {
    setPaidAmount(value);
  };

  const handleNextOrder = async () => {
    setIsWorking(true);
    if (!saleOrder) return null;
    const order = await serverActions.Sale.getNext(saleOrder.id);

    if (order.status === 200) {
      setSaleOrder(order.data);
      setCartItems((prev: any) => order.data.products);
      if (order.data.accountId !== null) {
        setSelectedCustomer((prev: any) => order.data?.account?.customer);
        setCustomerAccount((prev: any) => order.data?.account);
      } else {
        setSelectedCustomer((prev: any) => null);
      }
    }
    setIsWorking(false);
  };
  const handlePreviousOrder = async () => {
    setIsWorking(true);
    const order = await serverActions.Sale.getPrevious(
      saleOrder && saleOrder.id ? saleOrder.id : ""
    );
    if (order.status === 200) {
      setSaleOrder(order.data);
      setCartItems((prev: any) => order.data.products);
      if (order.data.accountId !== null) {
        setSelectedCustomer((prev: any) => order.data?.account?.customer);
        setCustomerAccount((prev: any) => order.data?.account);
      } else {
        setSelectedCustomer((prev: any) => null);
      }
    }
    setIsWorking(false);
  };
  const handleFirstOrder = async () => {
    setIsWorking(true);
    const order = await serverActions.Sale.getFirst();
    if (order.status === 200) {
      setSaleOrder(order.data);
      setCartItems(order.data.products);
      if (order.data.accountId !== null) {
        setSelectedCustomer((prev: any) => order.data?.account?.customer);
        setCustomerAccount((prev: any) => order.data?.account);
      } else {
        setSelectedCustomer((prev: any) => null);
      }
    }
    setIsWorking(false);
  };
  const handleLastOrder = async () => {
    setIsWorking(true);
    const order = await serverActions.Sale.getLast();

    if (order.status === 200) {
      setSaleOrder(order.data);
      setCartItems((prev: any) => order.data.products);
      if (order.data.accountId !== null) {
        setSelectedCustomer((prev: any) => order.data?.account?.customer);
        setCustomerAccount((prev: any) => order.data?.account);
      } else {
        setSelectedCustomer((prev: any) => null);
      }
    }
    setIsWorking(false);
  };
  const handleCreateNewSaleOrder = async () => {
    setIsWorking(true);
    const sale = await serverActions.Sale.create();
    if (sale.status === 200) {
      setSaleOrder(sale.data);
    }
    setIsWorking(false);
  };
  const handleCloseInvoice = async () => {
    if (saleOrder && saleOrder.id) {
      const response = await serverActions.Sale.save(
        saleOrder.id,
        cartItems,
        selectedCustomer?.id,
        paidAmount
      );
      if (response.status === 200) {
        setSaleOrder(null);
        setProductList([]);
        setCartItems([]);
        setSelectedCustomer(null);
      } else {
        toast.error(response.message);
      }
    }
  };

  const removeProductFromCart = (barcode: string) => {
    let newCartItems: any = [];
    cartItems.forEach((item: any) => {
      if (item.barcodeRegister[0].barcode !== barcode) {
        newCartItems.push(item);
      }
    });

    setCartItems(newCartItems);
  };

  const isTargetProduct = (targetText: string, product: any) => {
    const normalizedTarget = targetText.toLowerCase();

    const barcode = product.barcodeRegister[0].barcode;
    for (let item of cartItems) {
      if (item.barcodeRegister[0].barcode === barcode) {
        return false;
      }
    }

    return (
      product.name.toLowerCase().includes(normalizedTarget) ||
      product.type.name.toLowerCase().includes(normalizedTarget) ||
      product.brand.name.toLowerCase().includes(normalizedTarget) ||
      product.brand.description?.toLowerCase().includes(normalizedTarget) ||
      product.barcodeRegister.some((barcodeEntry: any) =>
        barcodeEntry.barcode.toLowerCase().includes(normalizedTarget)
      ) ||
      product.barcodeRegister.some((barcodeEntry: any) =>
        barcodeEntry.color.toLowerCase().includes(normalizedTarget)
      ) ||
      product.category.name.toLowerCase().includes(normalizedTarget) ||
      product.category.description?.toLowerCase().includes(normalizedTarget) ||
      product.price.toString().toLowerCase().includes(normalizedTarget) ||
      product.cost.toString().toLowerCase().includes(normalizedTarget)
    );
  };
  const isTargetCustomer = (targetText: string, product: any) => {
    const normalizedTarget = targetText.toLowerCase();

    return (
      product.name.toLowerCase().includes(normalizedTarget) ||
      product.code.toLowerCase().includes(normalizedTarget) ||
      product?.primaryPhone?.toLowerCase().includes(normalizedTarget)
    );
  };

  useEffect(() => {
    setCartSearchText("");
    setSearchProductText("");
    setSearchCustomerText("");
    fetchProducts();
    fetchCustomers();
  }, [saleOrder]);

  const fetchCustomers = async () => {
    setIsWorking(true);
    const response = await serverActions.Customer.listAll();
    response.data = ComboBox_ADD_VALUE_TO_EACH_OPTION(response.data);
    setCustomers((prev: any) => response.data);
    setIsWorking(false);
  };

  const fetchProducts = async () => {
    const response = await serverActions.Inventory.list();
    response.data = ComboBox_ADD_VALUE_TO_EACH_OPTION(response.data);
    setProductList((prev: any) => response.data);
  };

  function sumTotal() {
    let total = 0;
    cartItems.forEach((item: any) => {
      if (!item.amount) return;
      total += Number(item.amount || 0);
    });
    return total;
  }

  const handleAddProductToCart = (product: any) => {
    function isAlreadyExists(value: string) {
      let isExists = false;

      for (let i = 0; i < cartItems.length; i++) {
        if (
          cartItems[i].barcodeRegister[0].barcode
            .toLowerCase()
            .includes(value.toLocaleLowerCase())
        ) {
          isExists = true;
          break;
        }
      }

      return isExists;
    }

    if (isAlreadyExists(product.barcodeRegister[0].barcode) === true) {
      toast.message(
        `${product.name} with barcode ${product.barcodeRegister[0].barcode} is already in the cart.`
      );
      return;
    }
    setSearchProductText("");
    const newItem = { ...product, amount: 0 };
    setCartItems((prev: any) => [...prev, newItem]);
  };

  const handleCustomerSelect = async (customer: customer | null) => {
    setIsWorking(true);
    if (saleOrder) {
      if (customer) {
        const response = await serverActions.Customer.assignToSale(
          customer,
          saleOrder.id
        );

        if (response.status === 200) {
          setSelectedCustomer(customer);
          toast.message(
            `${customer.name.toLocaleUpperCase()} is assigned to this sale order`
          );
        } else {
          if (response.status === 400) {
            toast.warning(response.message);
          } else {
            toast.error(response.message);
          }
        }
      }
    }
    setIsWorking(false);
  };

  const changeAmount = (barcode: string, amount: number) => {
    let newCartItems: any = [];
    cartItems.forEach((item: any) => {
      if (item.barcodeRegister[0].barcode === barcode) {
        item.amount = amount;
      }
      newCartItems.push(item);
    });

    setCartItems(newCartItems);
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="relative">
      <ResizablePanel defaultSize={40} className="w-full min-w-[260px]">
        <div className="relative h-full">
          <div>
            <div className="flex flex-col mb-2 lg:mb-0 lg:flex-row justify-between items-center lg:pr-2">
              <div
                className={`transition-all duration-800 ${
                  saleOrder && saleOrder.closed === true
                    ? "bg-interface-primary group p-1 scale-75 flex gap-1 items-center -ml-4 lg:-ml-5 -mr-5 lg:mr-0 mb-1 lg:mb-0 px-4 rounded-md ring-2 ring-interface-primary ring-offset-2"
                    : "bg-transparent"
                }`}
              >
                {saleOrder && saleOrder.closed === true && (
                  <Check className="w-6 h-6 text-white group-hover:-rotate-12 transition-all duration-200" />
                )}
                <Label
                  label={
                    saleOrder && saleOrder.closed === true
                      ? "Closed Invoice"
                      : "New Invoice"
                  }
                  size="text-lg"
                  className="text-start text-2xl my-2"
                  color={`${
                    saleOrder && saleOrder.closed === true
                      ? "text-white"
                      : "text-interface-primary"
                  }`}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleFirstOrder}>
                  <ChevronFirst className="w-3 h-3" />
                </Button>
                <Button onClick={handlePreviousOrder}>
                  <ChevronLeft className="w-3 h-3" />
                </Button>
                <Button onClick={handleNextOrder}>
                  <ChevronRight className="w-3 h-3" />
                </Button>
                <Button onClick={handleLastOrder}>
                  <ChevronLast className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="flex gap-2 items-center ">
              {!saleOrder?.orderNo && (
                <Button onClick={handleCreateNewSaleOrder}>Create</Button>
              )}
              {saleOrder && saleOrder.closed === false && (
                <Button onClick={handleCloseInvoice}>Close order</Button>
              )}
            </div>
            <div>
              {saleOrder && saleOrder.id && (
                <div className="flex flex-col gap-2 px-0 pr-2 mt-4">
                  <div className="grid grid-cols-2 gap-2">
                    <InputBox
                      label="Order #"
                      readonly
                      value={saleOrder ? `INV-${saleOrder.orderNo}` : ""}
                      disabled={saleOrder.closed === true}
                    />
                    <InputBox
                      label="Date"
                      readonly
                      value={
                        saleOrder && saleOrder.createdAt
                          ? new Date(saleOrder.createdAt).toDateString()
                          : ""
                      }
                      disabled={saleOrder.closed === true}
                    />
                  </div>
                  <div>
                    <InputBoxSearch
                      options={customers}
                      label="Search customer"
                      value={searchCustomerText}
                      defaultItem={selectedCustomer}
                      setValue={setSearchCustomerText}
                      setItem={handleCustomerSelect}
                      filterRow={customerSearchFilterRow}
                      filterFunction={isTargetCustomer}
                      disabled={saleOrder.closed === true}
                    />
                  </div>
                  <div>
                    <InputBoxSearch
                      options={productList}
                      label="Search Product"
                      value={searchProductText}
                      setValue={setSearchProductText}
                      setItem={handleAddProductToCart}
                      filterRow={productSearchFilterRow}
                      filterFunction={isTargetProduct}
                      disabled={saleOrder.closed === true}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="bg-interface-primary w-[98.8%] py-1 rounded pl-2 bottom-0 absolute text-white ">
            {formatCurrency(sumTotal(), "Rs")} | {cartItems.length} Items.
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel
        className={`min-w-[280px] ${
          saleOrder && saleOrder.closed === true
            ? "opacity-50 pointer-events-none  cursor-not-allowed"
            : "opacity-100"
        }`}
      >
        <div className="p-2 pr-0">
          <InputBox
            label="Search"
            placeholder="Search Product"
            setValue={setCartSearchText}
            value={cartSearchText}
            className="pointer-events-auto opacity-100"
          />
        </div>
        <ScrollArea className="h-[38dvh] pl-2">
          <div>
            <div className="flex flex-col gap-2">
              {cartItems &&
                cartItems.length > 0 &&
                cartItems.map((item: any, index: number) => {
                  let isExists = false;

                  if (
                    item.name
                      .toLowerCase()
                      .includes(cartSearchText.toLowerCase())
                  ) {
                    isExists = true;
                  }

                  if (
                    item.type.name
                      .toLowerCase()
                      .includes(cartSearchText.toLowerCase())
                  ) {
                    isExists = true;
                  }

                  if (
                    item.brand.name
                      .toLowerCase()
                      .includes(cartSearchText.toLowerCase())
                  ) {
                    isExists = true;
                  }

                  if (
                    item.brand.description
                      .toLowerCase()
                      .includes(cartSearchText.toLowerCase())
                  ) {
                    isExists = true;
                  }

                  if (
                    item.barcodeRegister[0].barcode
                      .toLowerCase()
                      .includes(cartSearchText.toLowerCase())
                  ) {
                    isExists = true;
                  }

                  if (
                    item.barcodeRegister[0].color
                      .toLowerCase()
                      .includes(cartSearchText.toLowerCase())
                  ) {
                    isExists = true;
                  }

                  if (
                    item.category.name
                      .toLowerCase()
                      .includes(cartSearchText.toLowerCase())
                  ) {
                    isExists = true;
                  }

                  if (
                    item.category.description &&
                    item.category.description
                      .toLowerCase()
                      .includes(cartSearchText.toLowerCase())
                  ) {
                    isExists = true;
                  }

                  if (
                    item.price
                      .toLowerCase()
                      .includes(cartSearchText.toLowerCase())
                  ) {
                    isExists = true;
                  }

                  if (
                    item.cost
                      .toLowerCase()
                      .includes(cartSearchText.toLowerCase())
                  ) {
                    isExists = true;
                  }

                  if (!isExists === true) {
                    return null;
                  }

                  return (
                    <div key={`${item.id}-${index}-${cartItems.length}`}>
                      <ProductOrderRow
                        item={item}
                        index={index + 1}
                        removeRow={removeProductFromCart}
                        changeAmount={changeAmount}
                        // updateProducts={updateProducts}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </ScrollArea>
        <div className="border-t-2 mt-4 py-2 ml-auto w-fit flex flex-col gap-2">
          <Label label="Total amount" size="text-sm" />
          <div className=" w-full font-semibold p-1 bg-zinc-200 border border-zinc-300 rounded">
            {formatCurrency(sumTotal(), "Rs")} | {cartItems.length} Items.
          </div>
          <div className="flex flex-col gap-2">
            <InputBox
              label="Amount paid"
              placeholder={formatCurrency(sumTotal(), "Rs")}
              setValue={handlePaidAmount}
              value={paidAmount}
              className="pointer-events-auto opacity-100 "
              type="number"
            />
          </div>
          <div className="flex flex-col gap-2">
            <InputBox
              label="Net amount"
              placeholder={formatCurrency(0, "Rs")}
              value={sumTotal() - paidAmount}
              className="pointer-events-auto opacity-100 "
              type="number"
              readonly
            />
          </div>
          <div className="flex items-center gap-2">
            <InputBox
              label="Prev balance"
              value={customerAccount?.balance}
              className="pointer-events-auto opacity-100 "
              type="number"
              readonly
            />
            <InputBox
              label="New balance"
              value={
                Number(customerAccount?.balance) -
                Number(sumTotal()) +
                Number(paidAmount)
              }
              className="pointer-events-auto opacity-100 "
              type="number"
              readonly
            />
          </div>
        </div>
      </ResizablePanel>
      {isWorking && <Loader />}
    </ResizablePanelGroup>
  );
};

export default SaleOrder;

const productSearchFilterRow = (
  option: any,
  index: number,
  selectedIndex: number | null
) => {
  return (
    <li
      className={`p-2 cursor-pointer ${
        index === selectedIndex ? "bg-interface-primary/20" : ""
      }`}
    >
      <div className="flex gap-2 items-center">
        <div className="opacity-50">{index + 1}-</div>
        <div className="grid grid-cols-3 place-items-center w-full">
          <div className="font-semibold tracking-tight text-md">
            {option.name}
          </div>
          <div className="text-xs p-1 bg-interface-hover border border-b-white rounded">
            {option.barcodeRegister[0].barcode}
          </div>
          <div className="grid grid-cols-2 place-items-center w-full">
            <div
              className="w-2 h-2 rounded-full ml-auto"
              style={{
                backgroundColor: option.barcodeRegister[0].color,
              }}
            ></div>
            {formalizeText(option.barcodeRegister[0].color)}
          </div>
        </div>
      </div>
    </li>
  );
};

const customerSearchFilterRow = (
  option: any,
  index: number,
  selectedIndex: number | null
) => {
  return (
    <li
      className={`p-2 cursor-pointer ${
        index === selectedIndex ? "bg-interface-primary/20" : ""
      }`}
    >
      <div className="flex gap-2 items-center">
        <div className="opacity-50">{index + 1}-</div>
        <div className="grid grid-cols-3 place-items-center w-full">
          <div className="font-semibold tracking-tight text-md">
            {option.name}
          </div>
          <div className="text-xs p-1 bg-interface-hover border border-b-white rounded">
            {option.code}
          </div>
          <div className="grid grid-cols-2 place-items-center w-full">
            <div className="w-2 h-2 rounded-full ml-auto"></div>
            {option.primaryPhone || "No phone"}
          </div>
        </div>
      </div>
    </li>
  );
};
