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
    <div className="bg-white min-h-[400px] overflow-y-auto w-full rounded drop-shadow-sm">
      {transactions.map((transaction, index) => {
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
  );
};

export default LedgerWindow;
