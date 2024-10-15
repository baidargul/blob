import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Props = {
  type?: "single" | "multiple";
  children: React.ReactNode;
  content?: React.ReactNode | void;
};

const AccordionProvider = (props: Props) => {
  return (
    <Accordion type={props.type ? props.type : "single"} collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="hover:no-underline">
          {props.children}
        </AccordionTrigger>
        <AccordionContent>
          {props.content ? props.content : null}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AccordionProvider;
