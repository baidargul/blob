import { SERVER_RESPONSE } from "@/serverActions/internal/server";
import { serverActions } from "@/serverActions/serverActions";
import { useEffect, useState } from "react";

type Props = {};

const InventoryManage = (props: Props) => {
  const [inventory, setInventory] = useState([]);
  const fetchInventory = async () => {
    const items: SERVER_RESPONSE = await serverActions.Inventory.list();
    if (items.status === 200) {
      console.log(items.data);
      setInventory(items.data);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div className="">
      <div>Inventory Manage</div>
    </div>
  );
};

export default InventoryManage;
