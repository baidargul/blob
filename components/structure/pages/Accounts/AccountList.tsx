"use client";
import InputBox from "@/components/myui/InputBox";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import React, { useEffect, useState } from "react";
import List from "./_components/List";
import { serverActions } from "@/serverActions/serverActions";
import { account } from "@prisma/client";
import AccountWindow from "./_components/AccountWindow";
import LedgerWindow from "./_components/LedgerWindow";

type Props = {};

const AccountList = (props: Props) => {
  const [selectedAccount, setSelectedAccount] = useState<account | null>(null);
  const [accountList, setAccountList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const handleSearchAccount = (value: string) => {
    setSearchText(value);
  };

  const fetchAccounts = async () => {
    const response = await serverActions.Account.listAll();
    console.log(response);
    setAccountList((prev: any) => response.data);
  };

  const handleAccountSelect = (selectedaccount: account) => {
    if (selectedaccount.id === selectedAccount?.id) {
      setSelectedAccount(null);
    } else {
      setSelectedAccount(selectedaccount);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div>
      <ResizablePanelGroup direction="horizontal" className="relative">
        <ResizablePanel defaultSize={40} className="w-full min-w-[260px]">
          <div className="p-2 flex flex-col gap-2">
            <InputBox
              label="Search"
              placeholder="Search Account"
              setValue={handleSearchAccount}
              value={searchText}
              className="pointer-events-auto opacity-100"
            />
            <List
              accounts={accountList}
              onSelect={handleAccountSelect}
              selectedAccount={selectedAccount}
              searchText={searchText}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle className="mx-1" />
        <ResizablePanel defaultSize={40} className="w-full min-w-[260px]">
          <div className="p-2">
            <AccountWindow
              selectedAccount={selectedAccount}
              setAccounts={setAccountList}
              setSelectedAccount={setSelectedAccount}
            />
          </div>
          <div className="p-2">
            <LedgerWindow selectedAccount={selectedAccount} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default AccountList;
