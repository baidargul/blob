import { Combobox } from "@/components/myui/ComboBox";
import InputBox from "@/components/myui/InputBox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import GeneralTab from "./partials/create/GeneralTab";

type Props = {};

const VendorCreateForm = (props: Props) => {
  return (
    <div>
      <div className="flex flex-col gap-1">
        <div></div>
        <div>
          <InputBox label="Vendor name" />
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
