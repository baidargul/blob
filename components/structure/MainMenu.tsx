"use client";
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
import { PageName, usePageStore } from "@/states/usePage";

type Props = {};

const MainMenu = (props: Props) => {
  const setPage = usePageStore((state) => state.setPage);
  const handleChangePage = (page: PageName) => {
    setPage(page);
  };

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
          <MenubarItem onClick={() => handleChangePage("ProductList")}>
            Product list
          </MenubarItem>
          <MenubarItem onClick={() => handleChangePage("InventoryList")}>
            Inventory
          </MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Find</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem onClick={() => handleChangePage("BarcodeSearch")}>
                IMEI Search
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Find...</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem onClick={() => handleChangePage("BrandList")}>
            Brand list
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => handleChangePage("CategoryList")}>
            Category list
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => handleChangePage("TypeList")}>
            Type list
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Customers</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => handleChangePage("ListAllCustomers")}>
            Customers list
          </MenubarItem>
          <MenubarItem>Find...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Vendors</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => handleChangePage("ListAllVendors")}>
            Vendor list
          </MenubarItem>
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
          <MenubarItem onClick={() => handleChangePage("SaleOrder")}>
            Create Invoice
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Invoice list</MenubarItem>
          <MenubarItem>Find...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Purchases</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => handleChangePage("PurchaseQuotation")}>
            Create quotation
          </MenubarItem>
          <MenubarItem onClick={() => handleChangePage("PurchaseOrder")}>
            Create purchase order
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Purchase list</MenubarItem>
          <MenubarItem>Find...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Accounts</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => handleChangePage("AccountList")}>
            Account list
          </MenubarItem>
          <MenubarItem>Create an account</MenubarItem>
          <MenubarItem>Purchase list</MenubarItem>
          <MenubarItem>Find...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Reports</MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>Sales</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem onClick={() => handleChangePage("BarcodeSearch")}>
                Daily Report
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Find...</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default MainMenu;
