"use client";
import InputBox from "@/components/myui/InputBox";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import React, { useEffect, useState } from "react";
import Report from "./DailySales/Report";
import DateTimePicker from "@/components/myui/DateTimePicker";

type Props = {};

const DailySales = (props: Props) => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  useEffect(() => {
    const thisMonthFirstDate = new Date();
    thisMonthFirstDate.setDate(1);
    setFromDate(thisMonthFirstDate);

    const thisMonthLastDate = new Date();
    thisMonthLastDate.setMonth(thisMonthLastDate.getMonth() + 1);
    thisMonthLastDate.setDate(0);
    setToDate(thisMonthLastDate);
  }, []);

  return (
    <div className="w-full h-full">
      <ResizablePanelGroup direction="horizontal" className="relative h-full">
        <ResizablePanel
          defaultSize={40}
          className="w-full min-w-[260px] h-full"
        >
          <div className="p-2 flex flex-col gap-2">
            <InputBox
              label="Search"
              placeholder="Search Account"
              //   setValue={handleSearchAccount}
              //   value={searchText}
              className="pointer-events-auto opacity-100"
            />
            <div className="flex items-center gap-2 w-full">
              <DateTimePicker
                label="From"
                value={fromDate}
                setValue={setFromDate}
              />
              <DateTimePicker label="To" value={toDate} setValue={setToDate} />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle className="mx-1" />
        <ResizablePanel defaultSize={40} className="w-full min-w-[260px]">
          <Report from={fromDate} to={toDate} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default DailySales;
