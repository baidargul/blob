import InputBox from "@/components/myui/InputBox";
import React from "react";

type Props = {};

const GeneralTab = (props: Props) => {
  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        <InputBox
          label="Primary Contact"
          placeholder="Name of the manager or owner to deal with"
        />
        <InputBox label="Position" placeholder="Manager or owner" />
        <InputBox label="Phone" placeholder="03" type="number" />
        <InputBox
          label="Secondry Contact"
          placeholder="Name of the manager or owner to deal with"
        />
        <InputBox label="Position" placeholder="Owner" />
        <InputBox label="Phone" placeholder="03" type="number" />
        <InputBox label="Email" placeholder="salesperson@email.com" />
        <InputBox label="Email" placeholder="admin@email.com" />
        <InputBox label="Wesbite" placeholder="vendorb2b.com" />
      </div>
    </div>
  );
};

export default GeneralTab;
