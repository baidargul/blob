import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {};

const PurchaseQuotation = (props: Props) => {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={40} className="pl-2">
        One
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <ScrollArea className="h-[88dvh]"></ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default PurchaseQuotation;
