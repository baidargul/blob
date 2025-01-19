import { formalizeText, formatCurrency } from "@/lib/utils";
import { account } from "@prisma/client";
import React from "react";

type Props = {
  account: account;
  accounts: account[];
  index: number;
  selectedAccount: account | null;
  onClick?: (account: account) => void;
};

const ListRow = (props: Props) => {
  const handleClick = () => {
    if (props.onClick) {
      props.onClick(props.account);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`p-1 ${
        props.index === props.accounts.length - 1 ? "" : "border-b"
      } ${
        props.selectedAccount?.id === props.account.id
          ? "bg-interface-primary/60 "
          : "hover:bg-interface-primary/10 even:bg-interface-accent/10"
      }}`}
    >
      <div className="flex gap-1 items-start justify-between">
        <div className="flex flex-col items-start">
          <div>{formalizeText(props.account.title)}</div>
          {props.account.type && (
            <div className="text-xs uppercase tracking-wide scale-75 origin-top-left">
              {formalizeText(props.account.type)}
            </div>
          )}
        </div>
        <div>{formatCurrency(Number(props.account.balance), "Rs")}</div>
      </div>
    </div>
  );
};

export default ListRow;
