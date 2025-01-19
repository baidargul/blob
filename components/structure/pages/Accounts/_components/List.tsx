import { account } from "@prisma/client";
import React from "react";
import ListRow from "./ListRow";

type Props = {
  accounts: account[];
  onSelect: (account: account) => void;
  selectedAccount: account | null;
  searchText: string;
};

const List = (props: Props) => {
  return (
    <div className="bg-white rounded w-full h-full p-2">
      {props.accounts.map((account, index) => {
        let isExists = false;
        if (
          account.title.toLowerCase().includes(props.searchText.toLowerCase())
        ) {
          isExists = true;
        }

        if (
          account.type &&
          account.type.toLowerCase().includes(props.searchText.toLowerCase())
        ) {
          isExists = true;
        }

        if (
          account.balance &&
          account.balance.toString().includes(props.searchText.toLowerCase())
        ) {
          isExists = true;
        }

        if (!isExists) return null;

        return (
          <ListRow
            key={`account-${index}`}
            account={account}
            accounts={props.accounts}
            index={index}
            selectedAccount={props.selectedAccount}
            onClick={props.onSelect}
          />
        );
      })}
    </div>
  );
};

export default List;
