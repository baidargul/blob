"use client";
import { Combobox } from "@/components/myui/ComboBox";
import InputBox from "@/components/myui/InputBox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import GeneralTab from "./partials/create/GeneralTab";
import { vendor } from "@prisma/client";
import Button from "@/components/myui/Button";
import { serverActions } from "@/serverActions/serverActions";
import { toast } from "sonner";
import AddressTab from "./partials/create/AddressTab";

type Props = {
  refreshList?: () => void;
  selectedVendor?: vendor;
  setSelectedVendor?: any;
};

const VendorCreateForm = (props: Props) => {
  const [vendor, setVendor] = useState<vendor | any | null>(null);

  const [editVendor, setEditVendor] = useState<vendor | null>(null);

  const actions = {
    setName: (value: string) => {
      setVendor((prev: any) => ({ ...prev, name: value }));
    },
    setCode: (value: string) => {
      setVendor((prev: any) => ({ ...prev, code: value }));
    },

    setPrimaryContact: (value: string) => {
      setVendor((prev: any) => ({ ...prev, primaryContact: value }));
    },

    setPrimaryPosition: (value: string) => {
      setVendor((prev: any) => ({ ...prev, primaryPosition: value }));
    },

    setPrimaryPhone: (value: string) => {
      setVendor((prev: any) => ({ ...prev, primaryPhone: value }));
    },

    setSecondContact: (value: string) => {
      setVendor((prev: any) => ({ ...prev, secondContact: value }));
    },

    setSecondPosition: (value: string) => {
      setVendor((prev: any) => ({ ...prev, secondPosition: value }));
    },

    setSecondPhone: (value: string) => {
      setVendor((prev: any) => ({ ...prev, secondPhone: value }));
    },

    setEmail1: (value: string) => {
      setVendor((prev: any) => ({ ...prev, email1: value }));
    },

    setEmail2: (value: string) => {
      setVendor((prev: any) => ({ ...prev, email2: value }));
    },

    setWebsite: (value: string) => {
      setVendor((prev: any) => ({ ...prev, website: value }));
    },

    addresses: {
      add: () => {
        if (vendor) {
          const newAddress = {
            id: vendor.account?.addresses?.length + 1 || 1,
            title: "",
            address: "",
            city: "",
          };

          const updatedAddresses = [
            ...(vendor.account?.addresses || []),
            newAddress,
          ];

          setVendor((prev: any) => ({
            ...prev,
            account: {
              ...prev.account,
              addresses: updatedAddresses,
            },
          }));
        }
      },
      setTitle: (index: number, value: string) => {
        if (vendor) {
          const obj = vendor.account.addresses[index];
          obj.title = value;
          const updatedAddresses = [
            ...vendor.account.addresses.slice(0, index),
            obj,
            ...vendor.account.addresses.slice(index + 1),
          ];
          setVendor((prev: any) => ({
            ...prev,
            account: {
              ...prev.account,
              addresses: updatedAddresses,
            },
          }));
        }
      },
      setAddress: (id: number, value: string) => {
        if (vendor) {
          const obj = vendor.account.addresses[id];
          obj.address = value;
          const updatedAddresses = [
            ...vendor.account.addresses.slice(0, id),
            obj,
            ...vendor.account.addresses.slice(id + 1),
          ];
          setVendor((prev: any) => ({
            ...prev,
            account: {
              ...prev.account,
              addresses: updatedAddresses,
            },
          }));
        }
      },
      setCity: (id: number, value: string) => {
        if (vendor) {
          const obj = vendor.account.addresses[id];
          obj.city = value;
          const updatedAddresses = [
            ...vendor.account.addresses.slice(0, id),
            obj,
            ...vendor.account.addresses.slice(id + 1),
          ];
          setVendor((prev: any) => ({
            ...prev,
            account: {
              ...prev.account,
              addresses: updatedAddresses,
            },
          }));
        }
      },
    },
  };

  const handleSave = async () => {
    if (!editVendor) {
      if (!vendor) return;
      const response = await serverActions.Vendor.create(vendor);
      if (response?.status === 200) {
        toast.message(response.message);
        if (props.refreshList) {
          props.refreshList();
        }
        clearForm();
      } else {
        if (response.status === 400) {
          toast.warning(response.message);
        } else {
          toast.error(response.message);
        }
      }
    } else {
      const response = await serverActions.Vendor.update(vendor);
      if (response?.status === 200) {
        toast.message(response.message);
        setEditVendor(null);
        props.setSelectedVendor(response.data);
        if (props.refreshList) {
          props.refreshList();
        }
      } else if (response?.status === 400) {
        toast.warning(response.message);
      } else {
        toast.error(response.message);
      }
    }
  };

  const clearForm = () => {
    setVendor(null);
  };

  const handleCancel = () => {
    props.setSelectedVendor(null);
    clearForm();
    setEditVendor(null);
  };

  const handleEdit = () => {
    if (props.selectedVendor) {
      const temp = props.selectedVendor;
      setEditVendor(temp);
      props.setSelectedVendor(null);
      setTimeout(() => {
        setVendor(temp);
      }, 500);
    }
  };

  useEffect(() => {
    setVendor(props.selectedVendor ? props.selectedVendor : null);
  }, [props.selectedVendor]);

  return (
    <div>
      <div className="flex flex-col gap-1">
        <div></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          <InputBox
            label="Vendor name"
            value={vendor ? vendor.name : ""}
            setValue={actions.setName}
            disabled={props.selectedVendor ? true : false}
          />
          <InputBox
            label="Vendor code"
            value={vendor ? (vendor.code ? vendor.code : "") : ""}
            setValue={actions.setCode}
            disabled={props.selectedVendor ? true : false}
          />
          <Combobox
            label="Account"
            placeholder="Expense account"
            disabled={props.selectedVendor ? true : false}
          />
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
            <GeneralTab
              actions={actions}
              vendor={vendor}
              selectedVendor={props.selectedVendor}
            />
          </TabsContent>
          <TabsContent value="address">
            <AddressTab
              actions={actions}
              vendor={vendor}
              selectedVendor={props.selectedVendor}
            />
          </TabsContent>
        </Tabs>
      </div>
      <div className="mt-4 flex justify-end items-end">
        <div className="flex gap-2 items-center">
          {props.selectedVendor && <Button onClick={handleEdit}>Edit</Button>}
          <Button
            onClick={handleSave}
            disabled={props.selectedVendor && editVendor ? true : false}
          >
            Save
          </Button>
          {(props.selectedVendor || editVendor) && (
            <Button onClick={handleCancel}>Cancel</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorCreateForm;
