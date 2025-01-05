"use client";
import { Combobox } from "@/components/myui/ComboBox";
import InputBox from "@/components/myui/InputBox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import GeneralTab from "./partials/create/GeneralTab";
import { customer } from "@prisma/client";
import Button from "@/components/myui/Button";
import { serverActions } from "@/serverActions/serverActions";
import { toast } from "sonner";

type Props = {};

const CustomerCreateForm = (props: Props) => {
  const [customer, setCustomer] = useState<customer | null>(null);

  const actions = {
    setName: (value: string) => {
      setCustomer((prev: any) => ({ ...prev, name: value }));
    },
    setCode: (value: string) => {
      setCustomer((prev: any) => ({ ...prev, code: value }));
    },

    setPrimaryContact: (value: string) => {
      setCustomer((prev: any) => ({ ...prev, primaryContact: value }));
    },

    setPrimaryPosition: (value: string) => {
      setCustomer((prev: any) => ({ ...prev, primaryPosition: value }));
    },

    setPrimaryPhone: (value: string) => {
      setCustomer((prev: any) => ({ ...prev, primaryPhone: value }));
    },

    setSecondContact: (value: string) => {
      setCustomer((prev: any) => ({ ...prev, secondContact: value }));
    },

    setSecondPosition: (value: string) => {
      setCustomer((prev: any) => ({ ...prev, secondPosition: value }));
    },

    setSecondPhone: (value: string) => {
      setCustomer((prev: any) => ({ ...prev, secondPhone: value }));
    },

    setEmail1: (value: string) => {
      setCustomer((prev: any) => ({ ...prev, email1: value }));
    },

    setEmail2: (value: string) => {
      setCustomer((prev: any) => ({ ...prev, email2: value }));
    },

    setWebsite: (value: string) => {
      setCustomer((prev: any) => ({ ...prev, website: value }));
    },
  };

  const handleSave = async () => {
    if (!customer) return;
    const response = await serverActions.Vendor.create(customer);
    if (response?.status === 200) {
      toast.message(response.message);
      clearForm();
    } else {
      if (response.status === 400) {
        toast.warning(response.message);
      } else {
        toast.error(response.message);
      }
    }
  };

  const clearForm = () => {
    setCustomer(null);
  };

  return (
    <div>
      <div className="flex flex-col gap-1">
        <div></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          <InputBox
            label="Vendor name"
            value={customer ? customer.name : ""}
            setValue={actions.setName}
          />
          <InputBox
            label="Vendor code"
            value={customer ? (customer.code ? customer.code : "") : ""}
            setValue={actions.setCode}
          />
          <Combobox label="Account" placeholder="Expense account" />
        </div>
      </div>
      <div className="mt-4">
        <Tabs defaultValue="general" className="">
          <TabsList className="px-0 mb-10 md:my-0 grid grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="purchase">Purchase Info</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <GeneralTab actions={actions} customer={customer} />
          </TabsContent>
          <TabsContent value="address">Address</TabsContent>
        </Tabs>
      </div>
      <div className="mt-4 flex justify-end items-end">
        <div className="">
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerCreateForm;
