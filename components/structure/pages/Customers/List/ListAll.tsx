"use client";
import InputBox from "@/components/myui/InputBox";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import React, { useEffect, useState } from "react";
import { serverActions } from "@/serverActions/serverActions";
import List from "./_components/List";
import CustomerCreateForm from "../CreateForm";

type Props = {};

const CustomerListAll = (props: Props) => {
  const [searchText, setSearchText] = useState<string>("");
  const [customerList, setCustomerList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const handleSearchCustomer = (value: string) => {
    setSearchText(value);
  };
  const handleCustomerSelect = (account: any) => {
    if (account.id === selectedCustomer?.id) {
      setSelectedCustomer(null);
      return;
    }
    setSelectedCustomer(account);
  };

  const fetchCustomers = async () => {
    const response = await serverActions.Customer.listAll();
    setCustomerList((prev: any) => response.data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div>
      <ResizablePanelGroup direction="horizontal" className="relative">
        <ResizablePanel defaultSize={40} className="w-full min-w-[260px]">
          <div className="p-2 flex flex-col gap-2">
            <InputBox
              label="Search"
              placeholder="Search Customer"
              setValue={handleSearchCustomer}
              value={searchText}
              className="pointer-events-auto opacity-100"
            />
            <List
              entityList={customerList}
              onSelect={handleCustomerSelect}
              selectedEntity={selectedCustomer}
              searchText={searchText}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle className="mx-1 mr-3" />
        <ResizablePanel defaultSize={40} className="w-full min-w-[260px]">
          <CustomerCreateForm
            refreshList={fetchCustomers}
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default CustomerListAll;
