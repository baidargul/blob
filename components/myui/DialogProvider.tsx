import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  children: React.ReactNode;
  content: React.ReactNode;
  title: string;
};

const DialogProvider = (props: Props) => {
  return (
    <Dialog>
      <DialogTrigger>{props.children}</DialogTrigger>
      <DialogContent className="p-4 w-full">
        <DialogHeader className="">
          <DialogTitle>{props.title}</DialogTitle>
          <DialogDescription className="hidden">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full">{props.content}</div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogProvider;
