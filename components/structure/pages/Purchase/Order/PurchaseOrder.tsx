import InputBox from "@/components/myui/InputBox";
import Label from "@/components/myui/Label";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import ListRow from "../../Product/ListRow";
import PurchaseProductForm from "./PurchaseProductForm";

type Props = {};

const PurchaseOrder = (props: Props) => {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={40} className="w-full min-w-[260px]">
        <ScrollArea className="h-[88dvh]">
          <div>
            <Label
              label="Purchase Order"
              size="text-lg"
              className="text-center text-2xl my-2"
              color="text-interface-primary"
            />
            <div>
              <div className="flex flex-col gap-2 pl-2 pr-4 mt-4">
                <div></div>
                <div className="">
                  <PurchaseProductForm />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <ScrollArea className="h-[88dvh]"></ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default PurchaseOrder;
