import { SERVER_RESPONSE } from "@/serverActions/internal/server";
import { serverActions } from "@/serverActions/serverActions";
import { useEffect, useState } from "react";
import Row from "./components/Row";

type Props = {};

const InventoryManage = (props: Props) => {
  const [inventory, setInventory] = useState([]);
  const fetchInventory = async () => {
    const items: SERVER_RESPONSE = await serverActions.Inventory.list();
    if (items.status === 200) {
      setInventory(items.data);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div className="">
      <div>
        {inventory.map((item: any, index: number) => {
          return (
            <div key={item.id} className="even:bg-white/80">
              <Row product={item} index={index + 1} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InventoryManage;
