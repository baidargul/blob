import AccountList from "@/components/structure/pages/Accounts/AccountList";
import BrandList from "@/components/structure/pages/Brand/BrandList";
import CategoryList from "@/components/structure/pages/Category/CategoryList";
import CustomerCreateForm from "@/components/structure/pages/Customers/CreateForm";
import CustomerListAll from "@/components/structure/pages/Customers/List/ListAll";
import BarcodeSearch from "@/components/structure/pages/IMEISearch/BarcodeSearch";
import InventoryManage from "@/components/structure/pages/Inventory/InventoryManage";
import ProductList from "@/components/structure/pages/Product/List";
import PurchaseOrder from "@/components/structure/pages/Purchase/Order/PurchaseOrder";
import PurchaseQuotation from "@/components/structure/pages/Purchase/Quotation/PurchaseQuotation";
import DailySales from "@/components/structure/pages/Reports/Sales/Daily/DailySales";
import SaleOrder from "@/components/structure/pages/Sale/Order/SaleOrder";
import TypeList from "@/components/structure/pages/Type/TypeList";
import VendorCreateForm from "@/components/structure/pages/Vendors/CreateForm";
import ListAll from "@/components/structure/pages/Vendors/List/ListAll";
import { create } from "zustand";

type PageState = {
  id?: number;
  name: string;
  description?: string;
  page: React.ReactNode;
} | null;

export type PageName =
  | "Home"
  | "ProductList"
  | "PurchaseQuotation"
  | "BrandList"
  | "TypeList"
  | "CategoryList"
  | "PurchaseOrder"
  | "InventoryList"
  | "BarcodeSearch"
  | "VendorList"
  | "VendorCreate"
  | "SaleOrder"
  | "CustomerCreate"
  | "AccountList"
  | "ListAllVendors"
  | "ReportDailySales"
  | "ListAllCustomers";

type PageType = {
  page: PageState;
  setPage: (page: PageName) => void;
};

const pages: PageState[] = [
  {
    name: "ProductList",
    description: "Product List and definations page.",
    page: <ProductList />,
  },
  {
    name: "PurchaseQuotation",
    description: "Create order quotation",
    page: <PurchaseQuotation />,
  },
  {
    name: "BrandList",
    description: "Brand List and definations page.",
    page: <BrandList />,
  },
  {
    name: "CategoryList",
    description: "Category List and definations page.",
    page: <CategoryList />,
  },
  {
    name: "TypeList",
    description: "Type List and definations page.",
    page: <TypeList />,
  },
  {
    name: "PurchaseOrder",
    description: "Create purchase order",
    page: <PurchaseOrder />,
  },
  {
    name: "InventoryList",
    description: "Manage inventory",
    page: <InventoryManage />,
  },
  {
    name: "BarcodeSearch",
    description: "Search by barcode",
    page: <BarcodeSearch />,
  },
  {
    name: "ListAllVendors",
    description: "List of vendors",
    page: <ListAll />,
  },
  {
    name: "VendorCreate",
    description: "List of vendors",
    page: <VendorCreateForm />,
  },
  {
    name: "SaleOrder",
    description: "Create sale order",
    page: <SaleOrder />,
  },
  {
    name: "CustomerCreate",
    description: "List of customers",
    page: <CustomerCreateForm />,
  },
  {
    name: "ListAllCustomers",
    description: "List of customers",
    page: <CustomerListAll />,
  },
  {
    name: "AccountList",
    description: "List of Accounts",
    page: <AccountList />,
  },
  {
    name: "ReportDailySales",
    description: "Daily Sales Report",
    page: <DailySales />,
  },
];

export const usePageStore = create<PageType>((set) => ({
  page: {
    name: "Home",
    page: <div>Home Page</div>,
  },
  setPage: (page: PageName) =>
    set((state) => ({
      ...state,
      page: pages.find((p: PageState) => p && p.name === page) || null,
    })),
}));
