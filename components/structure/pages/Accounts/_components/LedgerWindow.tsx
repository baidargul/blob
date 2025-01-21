import { serverActions } from "@/serverActions/serverActions";
import { account } from "@prisma/client";
import React, { useEffect, useState } from "react";
import LedgerRow from "./_components/LedgerRow";

type Props = {
  selectedAccount: account | null;
};

const LedgerWindow = (props: Props) => {
  const [transactions, setTransactions] = useState([]);

  const fetchLedger = async () => {
    if (!props.selectedAccount?.id) return;
    const response = await serverActions.Account.transactions.list(
      props.selectedAccount.id
    );
    setTransactions(response.data.transactions);
  };

  useEffect(() => {
    fetchLedger();
  }, [props.selectedAccount]);

  return (
    <div>
      <div className="grid grid-cols-5 place-items-start bg-black text-white p-2 rounded-t">
        <div>Date</div>
        <div>Type</div>
        <div>Description</div>
        <div className="ml-auto pr-3">Amount</div>
        <div className="ml-auto pr-3">Balance</div>
      </div>
      <div className="bg-white h-[400px] max-h-[400px] overflow-y-auto w-full rounded drop-shadow-sm">
        {transactions.map((transaction: any, index: number) => {
          return (
            <LedgerRow
              key={index}
              transaction={transaction}
              index={index}
              transactions={transactions}
            />
          );
        })}
      </div>
    </div>
  );
};

export default LedgerWindow;
