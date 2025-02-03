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
          .toLowerCase()
          .includes(props.searchText.toLowerCase())) ||
      (entity.secondContact &&
        entity.secondContact
          .toString()
          .toLowerCase()
          .includes(props.searchText.toLowerCase())) ||
      (entity.primaryPhone &&
        entity.primaryPhone
          .toString()
          .toLowerCase()
          .includes(props.searchText.toLowerCase())) ||
      (entity.secondPhone &&
        entity.secondPhone
          .toString()
          .toLowerCase()
          .includes(props.searchText.toLowerCase())) ||
      (entity.email &&
        entity.email
          .toString()
          .toLowerCase()
          .includes(props.searchText.toLowerCase())) ||
      (entity.account &&
        entity.account?.title
          ?.toString()
          .toLowerCase()
          .includes(props.searchText.toLowerCase())) ||
      (entity.account &&
        entity.account?.type
          ?.toString()
          .toLowerCase()
          .includes(props.searchText.toLowerCase())) ||
      (entity.account &&
        entity.account?.description
          ?.toString()
          .toLowerCase()
          .includes(props.searchText.toLowerCase())) ||
      (entity.email2 &&
        entity.email2
          .toString()
          .toLowerCase()
          .includes(props.searchText.toLowerCase())) ||
      (entity.website &&
        entity.website
          .toString()
          .toLowerCase()
          .includes(props.searchText.toLowerCase()))
    );
  });

  return (
    <div>
      {filteredEntities.map((entity, index) => (
        <div
          key={index}
          className="bg-white rounded w-full h-full cursor-pointer"
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
