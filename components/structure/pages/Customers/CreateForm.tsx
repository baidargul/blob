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
import AddressTab from "./partials/create/AddressTab";

type Props = {
  refreshList?: () => void;
  selectedCustomer?: customer;
  setSelectedCustomer?: any;
};

const CustomerCreateForm = (props: Props) => {
  const [customer, setCustomer] = useState<customer | any | null>(null);
  const [editCustomer, setEditCustomer] = useState<customer | null>(null);

  useEffect(() => {
    setCustomer(props.selectedCustomer ? props.selectedCustomer : null);
  }, [props.selectedCustomer]);

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

    addresses: {
      add: () => {
        if (customer) {
          const newAddress = {
            id: customer.account?.addresses?.length + 1 || 1,
            title: "",
            address: "",
            city: "",
          };

          const updatedAddresses = [
            ...(customer.account?.addresses || []),
            newAddress,
          ];

          setCustomer((prev: any) => ({
            ...prev,
            account: {
              ...prev.account,
              addresses: updatedAddresses,
            },
          }));
        }
      },
      setTitle: (index: number, value: string) => {
        if (customer) {
          const obj = customer.account.addresses[index];
          obj.title = value;
          const updatedAddresses = [
            ...customer.account.addresses.slice(0, index),
            obj,
            ...customer.account.addresses.slice(index + 1),
          ];
          setCustomer((prev: any) => ({
            ...prev,
            account: {
              ...prev.account,
              addresses: updatedAddresses,
            },
          }));
        }
      },
      setAddress: (id: number, value: string) => {
        if (customer) {
          const obj = customer.account.addresses[id];
          obj.address = value;
          const updatedAddresses = [
            ...customer.account.addresses.slice(0, id),
            obj,
            ...customer.account.addresses.slice(id + 1),
          ];
          setCustomer((prev: any) => ({
            ...prev,
            account: {
              ...prev.account,
              addresses: updatedAddresses,
            },
          }));
        }
      },
      setCity: (id: number, value: string) => {
        if (customer) {
          const obj = customer.account.addresses[id];
          obj.city = value;
          const updatedAddresses = [
            ...customer.account.addresses.slice(0, id),
            obj,
            ...customer.account.addresses.slice(id + 1),
          ];
          setCustomer((prev: any) => ({
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
    if (!editCustomer) {
      if (!customer) return;
      const response = await serverActions.Customer.create(customer);
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
      const response = await serverActions.Customer.update(customer);
      if (response?.status === 200) {
        toast.message(response.message);
        setEditCustomer(null);
        props.setSelectedCustomer(response.data);
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

  const handleEdit = () => {
    if (props.selectedCustomer) {
      const temp = props.selectedCustomer;
      setEditCustomer(temp);
      props.setSelectedCustomer(null);
      setTimeout(() => {
        setCustomer(temp);
      }, 500);
    }
  };

  const handleCancel = () => {
    props.setSelectedCustomer(null);
    clearForm();
    setEditCustomer(null);
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
            label="Customer name"
            value={customer ? customer.name : ""}
            setValue={actions.setName}
            disabled={props.selectedCustomer ? true : false}
          />
          <InputBox
            label="Customer code"
            value={customer ? (customer.code ? customer.code : "") : ""}
            setValue={actions.setCode}
            disabled={props.selectedCustomer ? true : false}
          />
          <Combobox
            label="Account"
            placeholder="Expense account"
            disabled={props.selectedCustomer ? true : false}
          />
        </div>
      </div>
      <div className="mt-4">
        <Tabs defaultValue="general" className="">
          <TabsList className="px-0 mb-10 md:my-0 grid grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="purchase">Sale Info</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <GeneralTab
              actions={actions}
              customer={customer}
              selectedCustomer={props.selectedCustomer}
            />
          </TabsContent>
          <TabsContent value="address">
            <AddressTab
              actions={actions}
              customer={customer}
              selectedCustomer={props.selectedCustomer}
            />
          </TabsContent>
        </Tabs>
      </div>
      <div className="mt-4 flex justify-end items-end">
        <div className="flex gap-2 items-center">
          {props.selectedCustomer && <Button onClick={handleEdit}>Edit</Button>}
          <Button
            onClick={handleSave}
            disabled={props.selectedCustomer && editCustomer ? true : false}
          >
            Save
          </Button>
          {(props.selectedCustomer || editCustomer) && (
            <Button onClick={handleCancel}>Cancel</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerCreateForm;
