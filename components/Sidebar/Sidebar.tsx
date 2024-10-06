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
  title?: string;
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
        <div>
          {props.title && (
            <div className="p-2 bg-interface-accent/40 text-interface-text/80 font-semibold text-md rounded">
              {props.title}
            </div>
          )}
          <div>{props.content}</div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
