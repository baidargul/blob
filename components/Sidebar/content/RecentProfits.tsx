"use client";
import { serverActions } from "@/serverActions/serverActions";
import React from "react";

type Props = {};

const RecentProfits = (props: Props) => {
  const fetchReport = async () => {
    const response = await serverActions.Reports.RecentProfits.getSales();
    console.log(response);
  };

  fetchReport();

  return (
    <div className="">
      <div className="flex flex-col gap-2">
        <PanelToday />
        <PanelYesterday />
        <PanelDayBeforeYesterday />
      </div>
    </div>
  );
};

export default RecentProfits;

const PanelToday = (props: Props) => {
  return (
    <div className="p-4 rounded bg-interface-hover/40">
      <div className="font-semibold text-lg">Today</div>
      <div className="mt-1 grid grid-cols-2">
        <div>
          <div className="flex items-center gap-1 text-sm">
            <div className="font-semibold">Sales:</div>
            <div>Rs 1500</div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <div className="font-semibold">Worth:</div>
            <div>Rs 600</div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <div className="font-semibold">Difference:</div>
            <div>Rs 900</div>
          </div>
        </div>
        <div className="text-4xl ml-auto my-auto text-interface-primary font-bold">
          Rs 900
        </div>
      </div>
    </div>
  );
};

const PanelYesterday = (props: Props) => {
  return (
    <div className="p-4 rounded bg-interface-hover/40">
      <div className="font-semibold text-lg">Yesterday</div>
      <div className="mt-1 grid grid-cols-2">
        <div>
          <div className="flex items-center gap-1 text-sm">
            <div className="font-semibold">Sales:</div>
            <div>Rs 1500</div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <div className="font-semibold">Worth:</div>
            <div>Rs 600</div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <div className="font-semibold">Difference:</div>
            <div>Rs 900</div>
          </div>
        </div>
        <div className="text-4xl ml-auto my-auto text-interface-primary font-bold">
          Rs 900
        </div>
      </div>
    </div>
  );
};

const PanelDayBeforeYesterday = (props: Props) => {
  return (
    <div className="p-4 rounded bg-interface-hover/40">
      <div className="font-semibold text-lg">Day before yesterday</div>
      <div className="mt-1 grid grid-cols-2">
        <div>
          <div className="flex items-center gap-1 text-sm">
            <div className="font-semibold">Sales:</div>
            <div>Rs 1500</div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <div className="font-semibold">Worth:</div>
            <div>Rs 600</div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <div className="font-semibold">Difference:</div>
            <div>Rs 900</div>
          </div>
        </div>
        <div className="text-4xl ml-auto my-auto text-interface-primary font-bold">
          Rs 900
        </div>
      </div>
    </div>
  );
};
