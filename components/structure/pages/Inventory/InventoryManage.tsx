import { SERVER_RESPONSE } from "@/serverActions/internal/server";
import { serverActions } from "@/serverActions/serverActions";
import { useEffect, useState } from "react";
import Row from "./components/Row";
import InputBox from "@/components/myui/InputBox";
import DialogProvider from "@/components/myui/DialogProvider";
import ProductViewer from "./components/ProductViewer";

type Props = {};

const InventoryManage = (props: Props) => {
  const [searchText, setSearchText] = useState<string>("");
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

  const handleSearchChange = (value: string) => {
    setSearchText(value);
  };

  const filteredInventory = inventory.filter((item: any) => {
    if (searchText.length === 0) return true;

    const lowerSearchText = searchText.toLowerCase();

    return (
      item.name.toLowerCase().includes(lowerSearchText) ||
      item.category.name.toLowerCase().includes(lowerSearchText) ||
      item.type.name.toLowerCase().includes(lowerSearchText) ||
      item.brand.name.toLowerCase().includes(lowerSearchText) ||
      item.barcodeRegister[0]?.barcode
        ?.toLowerCase()
        .includes(lowerSearchText) ||
      item.barcodeRegister[0]?.color?.toLowerCase().includes(lowerSearchText) ||
      String(item.barcodeRegister[0]?.cost).includes(lowerSearchText) ||
      String(item.barcodeRegister[0]?.invoice).includes(lowerSearchText)
    );
  });

  return (
    <div className="">
      <div className="my-2">
        <InputBox
          setValue={handleSearchChange}
          value={searchText}
          label="Search"
          placeholder="Barcode, Name, Company, Type, Category, Amount,"
        />
      </div>
      {filteredInventory && filteredInventory.length > 0 && (
        <div>
          {filteredInventory.map((item: any, index: number) => (
            <div
              key={`${item.id}-${index}-${item.barcodeRegister[0].color}-${filteredInventory.length}`}
              className=" even:bg-white/80"
            >
              <DialogProvider
                title={String(item.brand.name).toLocaleUpperCase()}
                content={<ProductViewer product={item} index={index} />}
              >
                <Row product={item} index={index + 1} />
              </DialogProvider>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InventoryManage;
