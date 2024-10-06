import React from "react";
import "./style.css";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type Props = {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
};

const Sidebar = (props: Props) => {
  return (
    <Sheet>
      <SheetTrigger className="flex flex-col w-full p-0 m-0">
        {props.children}
      </SheetTrigger>
      <SheetContent side={props.side ? props.side : "left"} className="p-2">
        <div className="hidden">
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </div>
        <div>{props.content}</div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
