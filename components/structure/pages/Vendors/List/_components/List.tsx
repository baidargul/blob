import React from "react";
import ListRow from "./ListRow";

type Props = {
  entityList: any[];
  onSelect: (entity: any) => void;
  selectedEntity: any;
  searchText: string;
};

const List = (props: Props) => {
  let filteredEntities = props.entityList.filter((entity) => {
    return (
      entity.name.toLowerCase().includes(props.searchText.toLowerCase()) ||
      (entity.code &&
        entity.code.toLowerCase().includes(props.searchText.toLowerCase())) ||
      (entity.primaryContact &&
        entity.primaryContact
          .toString()
          .includes(props.searchText.toLowerCase())) ||
      (entity.secondContact &&
        entity.secondContact
          .toString()
          .includes(props.searchText.toLowerCase())) ||
      (entity.primaryPhone &&
        entity.primaryPhone
          .toString()
          .includes(props.searchText.toLowerCase())) ||
      (entity.secondPhone &&
        entity.secondPhone
          .toString()
          .includes(props.searchText.toLowerCase())) ||
      (entity.email &&
        entity.email.toString().includes(props.searchText.toLowerCase())) ||
      (entity.account &&
        entity.account?.title
          ?.toString()
          .includes(props.searchText.toLowerCase())) ||
      (entity.account &&
        entity.account?.type
          ?.toString()
          .includes(props.searchText.toLowerCase())) ||
      (entity.account &&
        entity.account?.description
          ?.toString()
          .includes(props.searchText.toLowerCase())) ||
      (entity.email2 &&
        entity.email2.toString().includes(props.searchText.toLowerCase())) ||
      (entity.website &&
        entity.website.toString().includes(props.searchText.toLowerCase()))
    );
  });

  return (
    <div>
      {filteredEntities.map((entity, index) => (
        <div
          key={index}
          className="bg-white rounded w-full h-full p-2 cursor-pointer"
          onClick={() => props.onSelect(entity)}
        >
          <ListRow
            entity={entity}
            index={index}
            entityList={props.entityList}
            selectedEntity={props.selectedEntity}
          />
        </div>
      ))}
    </div>
  );
};

export default List;
