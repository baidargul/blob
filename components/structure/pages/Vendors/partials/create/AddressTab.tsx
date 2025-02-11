import InputBox from "@/components/myui/InputBox";
import { vendor } from "@prisma/client";
import React, { useEffect } from "react";

type Props = {
  actions: any;
  vendor: any | null;
  selectedVendor?: vendor;
};

const AddressTab = (props: Props) => {
  const handleNewAddress = () => {
    props.actions.addresses.add();
  };

  return (
    <div>
      {props.vendor &&
        props.vendor?.account?.addresses.map((address: any, index: number) => {
          return (
            <div
              key={`address-${address.id}`}
              className="grid grid-cols-1 md:grid-cols-3 gap-2"
            >
              <InputBox
                label="Title"
                placeholder="Name of the address"
                value={address.title || ""}
                setValue={(val: any) =>
                  props.actions.addresses.setTitle(index, val)
                }
                disabled={props.selectedVendor ? true : false}
              />
              <InputBox
                label="Address"
                placeholder="Address details"
                value={address.address || ""}
                setValue={(val: any) =>
                  props.actions.addresses.setAddress(index, val)
                }
                disabled={props.selectedVendor ? true : false}
              />
              <InputBox
                label="City"
                placeholder=""
                value={address.city || ""}
                setValue={(val: any) =>
                  props.actions.addresses.setCity(index, val)
                }
                disabled={props.selectedVendor ? true : false}
              />
            </div>
          );
        })}
      {props.selectedVendor === null && (
        <div
          onClick={handleNewAddress}
          className="p-2 w-full mt-2 bg-interface-secondry/10 cursor-pointer text-center text-sm border border-interface-secondry rounded"
        >
          Add New
        </div>
      )}
    </div>
  );
};

export default AddressTab;
