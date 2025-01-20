import Tag from "@/components/myui/Tag";
import { formalizeText, formatCurrency } from "@/lib/utils";
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

  return (
    <div
      className={`w-full p-1 flex flex-col ${
        props.index === props.transactions.length - 1 ? "" : "border-b"
      }`}
    >
      <div className="grid grid-cols-4 place-items-center">
        <div className="text-xs mr-auto">
          {new Date(props.transaction.createdAt).toLocaleDateString() +
            " " +
            new Date(props.transaction.createdAt).toLocaleTimeString()}
        </div>
        <div className="scale-75 origin-top-left mr-auto">
          <Tag
            value={String(props.transaction.category.name).toLocaleUpperCase()}
          />
        </div>
        <div>{formalizeText(props.transaction.description)}</div>
        <div
          title={String(props.transaction.type).toLocaleUpperCase()}
          className="flex items-center gap-1 ml-auto"
        >
          {" "}
          {formatCurrency(Number(props.transaction.amount), "Rs")}
          <ArrowDownRight
            size={20}
            className={`${transactionIconClass} transition-all duration-500`}
          />
        </div>
      </div>
    </div>
  );
};

export default LedgerRow;
