import InputBox from "@/components/myui/InputBox";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import React from "react";
import Report from "./DailySales/Report";

type Props = {};

const DailySales = (props: Props) => {
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
          </div>
        </ResizablePanel>
        <ResizableHandle className="mx-1" />
        <ResizablePanel defaultSize={40} className="w-full min-w-[260px]">
          <Report />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default DailySales;
