import Button from "@/components/myui/Button";
import InputBox from "@/components/myui/InputBox";
import { vendor } from "@prisma/client";
import React from "react";

type Props = {
  actions: any;
  vendor: vendor | null;
};

const GeneralTab = (props: Props) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <InputBox
          label="Primary Contact"
          placeholder="Name of the manager or owner to deal with"
          value={
            props.vendor
              ? props.vendor.primaryContact
                ? props.vendor.primaryContact
                : ""
              : ""
          }
          setValue={props.actions.setPrimaryContact}
        />
        <InputBox
          label="Position"
          placeholder="Manager or owner"
          value={props.vendor?.primaryPosition || ""}
          setValue={props.actions.setPrimaryPosition}
        />
        <InputBox
          label="Phone"
          placeholder="03"
          type="number"
          value={props.vendor?.primaryPhone || ""}
          setValue={props.actions.setPrimaryPhone}
        />
        <InputBox
          label="Secondry Contact"
          placeholder="Name of the manager or owner to deal with"
          value={props.vendor?.secondContact || ""}
          setValue={props.actions.setSecondContact}
        />
        <InputBox
          label="Position"
          placeholder="Owner"
          value={props.vendor?.secondPosition || ""}
          setValue={props.actions.setSecondPosition}
        />
        <InputBox
          label="Phone"
          placeholder="03"
          type="number"
          value={props.vendor?.secondPhone || ""}
          setValue={props.actions.setSecondPhone}
        />
        <InputBox
          label="Email"
          placeholder="salesperson@email.com"
          value={props.vendor?.email1 || ""}
          setValue={props.actions.setEmail1}
        />
        <InputBox
          label="Email"
          placeholder="admin@email.com"
          value={props.vendor?.email2 || ""}
          setValue={props.actions.setEmail2}
        />
        <InputBox
          label="Wesbite"
          placeholder="vendorb2b.com"
          value={props.vendor?.website || ""}
          setValue={props.actions.setWebsite}
        />
      </div>
    </div>
  );
};

export default GeneralTab;
