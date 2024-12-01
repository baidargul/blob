"use client";
import { Combobox } from "@/components/myui/ComboBox";
import InputBox from "@/components/myui/InputBox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import GeneralTab from "./partials/create/GeneralTab";
import { vendor } from "@prisma/client";

type Props = {};

const VendorCreateForm = (props: Props) => {
  const [vendor, setVendor] = useState<vendor | null>(null);

  const actions = {
    setName: (value: string) => {
      setVendor((prev: any) => ({ ...prev, name: value }));
    },
    setCode: (value: string) => {
      setVendor((prev: any) => ({ ...prev, code: value }));
    },
  };

  return (
    <div>
      <div className="flex flex-col gap-1">
        <div></div>
        <div className="grid grid-cols-3 gap-1">
          <InputBox
            label="Vendor name"
            value={vendor ? vendor.name : ""}
            setValue={actions.setName}
          />
          <InputBox
            label="Vendor code"
            value={vendor ? (vendor.code ? vendor.code : "") : ""}
            setValue={actions.setCode}
          />
          <Combobox label="Account" placeholder="Expense account" />
        </div>
      </div>
      <div className="mt-4">
        <Tabs defaultValue="general" className="">
          <TabsList className="px-0">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="purchase">Purchase Info</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <GeneralTab />
          </TabsContent>
          <TabsContent value="address">Address</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VendorCreateForm;
