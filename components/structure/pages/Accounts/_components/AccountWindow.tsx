import {
  Combobox,
  ComboBox_ADD_VALUE_TO_EACH_OPTION,
} from "@/components/myui/ComboBox";
import InputBox from "@/components/myui/InputBox";
import InputBoxSearch from "@/components/myui/InputBoxSearch";
import Tag from "@/components/myui/Tag";
import { formalizeText, formatCurrency } from "@/lib/utils";
import { serverActions } from "@/serverActions/serverActions";
import { account, accountType } from "@prisma/client";
import React, { useEffect, useRef, useState } from "react";
import Button from "@/components/myui/Button";
import { toast } from "sonner";

type Props = {
  selectedAccount: account | null;
  setAccounts: any;
  setSelectedAccount: any;
};

const AccountWindow = (props: Props) => {
  const titleRef: any = useRef(null);
  const [accountTypes, setAccountTypes] = useState<any | []>([]);
  const [selectedAccountType, setSelectedAccountType] = useState<any | null>(
    null
  );
  const [accountTitle, setAccountTitle] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(true);

  const fetchAccountTypes = async () => {
    let types: any = [
      { name: "vendor" },
      { name: "customer" },
      { name: "owner" },
      { name: "employee" },
      { name: "bank" },
      { name: "cash" },
      { name: "expenses" },
      { name: "income" },
      { name: "cogp" },
      { name: "cogs" },
      { name: "inventory" },
    ];

    types = ComboBox_ADD_VALUE_TO_EACH_OPTION(types);
    setAccountTypes(types);
  };

  useEffect(() => {
    fetchAccountTypes();
    if (props.selectedAccount) {
      if (props.selectedAccount?.type) {
        setEditMode(false);
        setSelectedAccountType({
          name: formalizeText(props.selectedAccount.type),
        });
        setAccountTitle(formalizeText(props.selectedAccount.title));
      }
    } else {
      reset();
    }
  }, [props.selectedAccount]);

  const reset = () => {
    setSelectedAccountType(null);
    setAccountTitle("");
    setEditMode(false);
  };

  const handleSave = async () => {
    if (!accountTitle) {
      toast.error("Account title is required");
      return;
    }

    if (!selectedAccountType?.name) {
      toast.error("Account type is required");
      return;
    }

    const response = await serverActions.Account.createAccount(
      accountTitle,
      selectedAccountType.name,
      0
    );

    if (response.status === 200) {
      toast.success(response.message);
      props.setAccounts((prev: any) => response.data);
      reset();
    } else if (response.status === 400) {
      toast.warning(response.message);
    } else {
      toast.error(response.message);
    }
  };

  const handleCreate = () => {
    props.setSelectedAccount(null);
    setAccountTitle("");
    setSelectedAccountType(null);
    setEditMode(true);
  };

  const handleAccountTitleChange = (value: string) => {
    setAccountTitle(value);
  };

  const handleCancel = () => {
    if (!props.selectedAccount) {
      setAccountTitle("");
      setSelectedAccountType(null);
    }
    setEditMode(false);
  };

  const handleEditMode = () => {
    setEditMode(true);
    if (titleRef) {
      titleRef.current.select();
    }
  };

  const handleDelete = async () => {
    if (!props.selectedAccount?.id) {
      toast.warning("Please select account to delete");
      return;
    }
    const response = await serverActions.Account.remove(
      props.selectedAccount.id
    );
    if (response.status === 200) {
      toast.success(response.message);
      props.setAccounts((prev: any) => response.data);
      props.setSelectedAccount(null);
      reset();
      setEditMode(true);
    } else if (response.status === 400) {
      toast.warning(response.message);
    } else {
      toast.error(response.message);
    }
  };

  const handleUpdate = async () => {
    if (!props.selectedAccount?.id) {
      toast.warning("Please select account to update");
      return;
    }

    if (!accountTitle) {
      toast.error("Account title is required");
      return;
    }

    if (!selectedAccountType.name) {
      toast.error("Account type is required");
      return;
    }

    const response = await serverActions.Account.update(
      props.selectedAccount.id,
      accountTitle,
      selectedAccountType.name
    );
    if (response.status === 200) {
      toast.success(response.message);
      props.setAccounts((prev: any) => response.data);
      reset();
      setEditMode(false);
    } else if (response.status === 400) {
      toast.warning(response.message);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="flex flex-col gap-2 ">
      <div className="font-semibold border-b pb-1 flex justify-between items-start">
        <div>{formalizeText(props.selectedAccount?.title || "")}</div>
        <div className="tracking-wide font-normal">
          {formatCurrency(Number(props.selectedAccount?.balance) || 0, "Rs")}
        </div>
      </div>
      <div>
        {props.selectedAccount?.type && (
          <Tag
            value={props.selectedAccount?.type}
            className="uppercase tracking-wide"
          />
        )}
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <InputBox
            label={`Name`}
            value={accountTitle}
            setValue={handleAccountTitleChange}
            disabled={!editMode}
            ref={titleRef}
          />
          <Combobox
            options={accountTypes}
            label="Type"
            value={selectedAccountType}
            setValue={setSelectedAccountType}
            placeholder="Select Account Type"
            disabled={!editMode}
          />
        </div>
      </div>
      <div>
        <div className="flex flex-wrap gap-2">
          {!props.selectedAccount && !editMode && (
            <Button onClick={handleCreate}>Create</Button>
          )}
          {!props.selectedAccount &&
            editMode &&
            accountTitle.length > 0 &&
            selectedAccountType?.name && (
              <Button onClick={handleSave}>Save</Button>
            )}
          {props.selectedAccount && !editMode && (
            <Button onClick={handleEditMode}>Edit</Button>
          )}
          {props.selectedAccount && editMode && (
            <Button onClick={handleUpdate}>Update</Button>
          )}
          {editMode && (selectedAccountType?.name || accountTitle) && (
            <Button onClick={handleCancel}>Cancel</Button>
          )}
          {props.selectedAccount && props.selectedAccount.id && (
            <Button onClick={handleDelete}>Delete</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountWindow;
