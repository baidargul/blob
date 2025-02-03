import Tag from "@/components/myui/Tag";
import React from "react";

type Props = {
  entity: any;
  index: number;
  entityList: any[];
  selectedEntity: any | null;
};

const ListRow = (props: Props) => {
  return (
    <div
      className={`p-2 ${
        props.index === props.entityList.length - 1 ? "" : "border-b"
      } ${
        props.selectedEntity?.id === props.entity.id
          ? "bg-interface-primary/60 "
          : "hover:bg-interface-primary/10 even:bg-interface-accent/10"
      }}`}
    >
      <div className="flex items-center gap-1">
        <div className="tracking-wide">{props.entity.name}</div>
        {props.entity.code && props.entity.code.length > 0 && (
          <div className="mb-1/2 scale-90 origin-top-left">
            <Tag value={props.entity.code} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ListRow;
