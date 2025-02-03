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
import VendorCreateForm from "../CreateForm";

type Props = {};

const ListAll = (props: Props) => {
  const [searchText, setSearchText] = useState<string>("");
  const [vendorList, setVendorList] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const handleSearchVendor = (value: string) => {
    setSearchText(value);
  };
  const handleVendorSelect = (account: any) => {
    if (account.id === selectedVendor?.id) {
      setSelectedVendor(null);
      return;
    }
    setSelectedVendor(account);
  };

  const fetchVendors = async () => {
    const response = await serverActions.Vendor.listAll();
    setVendorList((prev: any) => response.data);
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div>
      <ResizablePanelGroup direction="horizontal" className="relative">
        <ResizablePanel defaultSize={40} className="w-full min-w-[260px]">
          <div className="p-2 flex flex-col gap-2">
            <InputBox
              label="Search"
              placeholder="Search Vendor"
              setValue={handleSearchVendor}
              value={searchText}
              className="pointer-events-auto opacity-100"
            />
            <List
              entityList={vendorList}
              onSelect={handleVendorSelect}
              selectedEntity={selectedVendor}
              searchText={searchText}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle className="mx-1 mr-3" />
        <ResizablePanel defaultSize={40} className="w-full min-w-[260px]">
          <VendorCreateForm
            refreshList={fetchVendors}
            selectedVendor={selectedVendor}
            setSelectedVendor={setSelectedVendor}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ListAll;
