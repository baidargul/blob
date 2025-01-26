import Tag from "@/components/myui/Tag";
import { formalizeText, formatCurrency, formatDate } from "@/lib/utils";
import { transactions } from "@prisma/client";
import { ArrowDownRight } from "lucide-react";
import React from "react";

type Props = {
  transaction: any;
  index: number;
  transactions: any;
};

const LedgerRow = (props: Props) => {
  let transactionIconClass =
    props.transaction.type === "debit"
      ? "text-red-500 rotate-180"
      : "text-green-500 ";

  let key = "purchase";
  if (props.transaction.category.name === "sale") {
    key = "sale";
  } else if (props.transaction.category.name === "purchase") {
    key = "purchase";
  }

  return (
    <div
      className={`w-full p-1 flex flex-col hover:bg-gradient-to-l from-interface-primary/10 to-transparent ${
        props.index === props.transactions.length - 1 ? "" : "border-b"
      }`}
    >
      <div className="grid grid-cols-5 place-items-start">
        <div className="text-xs mr-auto">
          {formatDate(new Date(props.transaction.createdAt)) +
            " " +
            new Date(props.transaction.createdAt).toLocaleTimeString()}
        </div>
        <div className="scale-75 origin-top-left mr-auto">
          <Tag
            value={String(props.transaction.category.name).toLocaleUpperCase()}
          />
        </div>
        <div className="font-mono text-sm">
          <div className="font-bold">
            <div>PO# {props.transaction?.[key][0]?.orderNo}</div>
          </div>
          {formalizeText(props.transaction.description)}
        </div>
        <div
          title={String(props.transaction.type).toLocaleUpperCase()}
          className="flex items-center gap-1 ml-auto text-sm"
        >
          {" "}
          {formatCurrency(Number(props.transaction.amount), "Rs")}
          <ArrowDownRight
            size={20}
            className={`${transactionIconClass} transition-all duration-500`}
          />
        </div>
        <div title={`Balance`} className="flex items-center gap-1 ml-auto pr-1">
          {formatCurrency(Number(props.transaction.balance), "Rs")}
        </div>
      </div>
    </div>
  );
};

export default LedgerRow;
