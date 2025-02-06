"use client";
import { formatCurrency } from "@/lib/utils";
import { serverActions } from "@/serverActions/serverActions";
import React, { useEffect } from "react";
import { toast } from "sonner";

type Props = {};

const RecentProfits = (props: Props) => {
  const [today, setToday] = React.useState<{
    cost: number;
    profit: number;
    sales: number;
  } | null>(null);
  const [yesterday, setYesterday] = React.useState<{
    cost: number;
    profit: number;
    sales: number;
  } | null>(null);

  const [dayBeforeYesterday, setDayBeforeYesterday] = React.useState<{
    cost: number;
    profit: number;
    sales: number;
  } | null>(null);

  const fetchReport = async () => {
    const response = await serverActions.Reports.RecentProfits.getSales();
    if (response.status === 200) {
      setToday(response.data.today);
      setYesterday(response.data.yesterday);
      setDayBeforeYesterday(response.data.dayBeforeYesterday);
    } else if (response.status === 400) {
      toast.warning(response.message);
    } else {
      toast.error(response.message);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <div className="">
      <div className="flex flex-col gap-2">
        <PanelToday today={today} />
        <PanelYesterday yesterday={yesterday} />
        <PanelDayBeforeYesterday dayBeforeYesterday={dayBeforeYesterday} />
      </div>
    </div>
  );
};

export default RecentProfits;

const PanelToday = ({
  today,
}: {
  today: { cost: number; profit: number; sales: number } | null;
}) => {
  return (
    <div className="p-4 rounded bg-interface-hover/40">
      <div className="font-semibold text-lg">Today</div>
      <div className="mt-1 grid grid-cols-2">
        <div>
          <div className="flex items-center gap-1 text-sm">
            <div className="font-semibold">Sales:</div>
            <div>{formatCurrency(today?.sales || 0)}</div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <div className="font-semibold">Worth:</div>
            <div>{formatCurrency(today?.cost || 0)}</div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <div className="font-semibold">Difference:</div>
            <div>{formatCurrency(today?.profit || 0)}</div>
          </div>
        </div>
        <div className="text-4xl ml-auto my-auto text-interface-primary font-bold">
          {formatCurrency(today?.profit || 0)}
        </div>
      </div>
    </div>
  );
};

const PanelYesterday = ({
  yesterday,
}: {
  yesterday: {
    cost: number;
    profit: number;
    sales: number;
  } | null;
}) => {
  return (
    <div className="p-4 rounded bg-interface-hover/40">
      <div className="font-semibold text-lg">Yesterday</div>
      <div className="mt-1 grid grid-cols-2">
        <div>
          <div className="flex items-center gap-1 text-sm">
            <div className="font-semibold">Sales:</div>
            <div>{formatCurrency(yesterday?.sales || 0)}</div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <div className="font-semibold">Worth:</div>
            <div>{formatCurrency(yesterday?.cost || 0)}</div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <div className="font-semibold">Difference:</div>
            <div>{formatCurrency(yesterday?.profit || 0)}</div>
          </div>
        </div>
        <div className="text-4xl ml-auto my-auto text-interface-primary font-bold">
          {formatCurrency(yesterday?.profit || 0)}
        </div>
      </div>
    </div>
  );
};

const PanelDayBeforeYesterday = ({
  dayBeforeYesterday,
}: {
  dayBeforeYesterday: {
    cost: number;
    profit: number;
    sales: number;
  } | null;
}) => {
  return (
    <div className="p-4 rounded bg-interface-hover/40">
      <div className="font-semibold text-lg">Day before yesterday</div>
      <div className="mt-1 grid grid-cols-2">
        <div>
          <div className="flex items-center gap-1 text-sm">
            <div className="font-semibold">Sales:</div>
            <div>{formatCurrency(dayBeforeYesterday?.sales || 0)}</div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <div className="font-semibold">Worth:</div>
            <div>{formatCurrency(dayBeforeYesterday?.cost || 0)}</div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <div className="font-semibold">Difference:</div>
            <div>{formatCurrency(dayBeforeYesterday?.profit || 0)}</div>
          </div>
        </div>
        <div className="text-4xl ml-auto my-auto text-interface-primary font-bold">
          {formatCurrency(dayBeforeYesterday?.profit || 0)}
        </div>
      </div>
    </div>
  );
};
