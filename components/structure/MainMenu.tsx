import React from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { MenubarSub } from "@radix-ui/react-menubar";

type Props = {};

const MainMenu = (props: Props) => {
  return (
    <Menubar className="bg-zinc-100">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Audit</MenubarItem>
          <MenubarItem>Dashboard creator</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>IMEI generator</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Reset</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Settings</MenubarItem>
          <MenubarItem>Purge</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Products</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Product list</MenubarItem>
          <MenubarItem>Inventory</MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Find</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>IMEI Search</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Find...</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Brand list</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Category list</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Type list</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Customers</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Customers list</MenubarItem>
          <MenubarItem>Find...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Vendors</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Vendor list</MenubarItem>
          <MenubarItem>Find...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Employees</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Employee list</MenubarItem>
          <MenubarItem>Find...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Sales</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Create quotation</MenubarItem>
          <MenubarItem>Create Invoice</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Invoice list</MenubarItem>
          <MenubarItem>Find...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Purchases</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Create quotation</MenubarItem>
          <MenubarItem>Create purchase order</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Purchase list</MenubarItem>
          <MenubarItem>Find...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Accounts</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Account list</MenubarItem>
          <MenubarItem>Create an account</MenubarItem>
          <MenubarItem>Purchase list</MenubarItem>
          <MenubarItem>Find...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Reports</MenubarTrigger>
        {/* <MenubarContent>
          <MenubarItem>Account list</MenubarItem>
          <MenubarItem>Create an account</MenubarItem>
          <MenubarItem>Purchase list</MenubarItem>
          <MenubarItem>Find...</MenubarItem>
        </MenubarContent> */}
      </MenubarMenu>
    </Menubar>
  );
};

export default MainMenu;