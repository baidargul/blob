import Button from "@/components/myui/Button";
import InputBox from "@/components/myui/InputBox";
import { customer } from "@prisma/client";
import React from "react";

type Props = {
  actions: any;
  customer: customer | null;
  selectedCustomer?: customer;
};

const GeneralTab = (props: Props) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <InputBox
          label="Primary Contact"
          placeholder="Name of the manager or owner to deal with"
          value={
            props.customer
              ? props.customer.primaryContact
                ? props.customer.primaryContact
                : ""
              : ""
          }
          setValue={props.actions.setPrimaryContact}
          disabled={props.selectedCustomer ? true : false}
        />
        <InputBox
          label="Position"
          placeholder="Manager or owner"
          value={props.customer?.primaryPosition || ""}
          setValue={props.actions.setPrimaryPosition}
          disabled={props.selectedCustomer ? true : false}
        />
        <InputBox
          label="Phone"
          placeholder="03"
          type="number"
          value={props.customer?.primaryPhone || ""}
          setValue={props.actions.setPrimaryPhone}
          disabled={props.selectedCustomer ? true : false}
        />
        <InputBox
          label="Secondry Contact"
          placeholder="Name of the manager or owner to deal with"
          value={props.customer?.secondContact || ""}
          setValue={props.actions.setSecondContact}
          disabled={props.selectedCustomer ? true : false}
        />
        <InputBox
          label="Position"
          placeholder="Owner"
          value={props.customer?.secondPosition || ""}
          setValue={props.actions.setSecondPosition}
          disabled={props.selectedCustomer ? true : false}
        />
        <InputBox
          label="Phone"
          placeholder="03"
          type="number"
          value={props.customer?.secondPhone || ""}
          setValue={props.actions.setSecondPhone}
          disabled={props.selectedCustomer ? true : false}
        />
        <InputBox
          label="Email"
          placeholder="salesperson@email.com"
          value={props.customer?.email1 || ""}
          setValue={props.actions.setEmail1}
          disabled={props.selectedCustomer ? true : false}
        />
        <InputBox
          label="Email"
          placeholder="admin@email.com"
          value={props.customer?.email2 || ""}
          setValue={props.actions.setEmail2}
          disabled={props.selectedCustomer ? true : false}
        />
        <InputBox
          label="Wesbite"
          placeholder="customerb2b.com"
          value={props.customer?.website || ""}
          setValue={props.actions.setWebsite}
          disabled={props.selectedCustomer ? true : false}
        />
      </div>
    </div>
  );
};

export default GeneralTab;
