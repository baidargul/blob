import BrandList from "@/components/structure/pages/Brand/BrandList";
import CategoryList from "@/components/structure/pages/Category/CategoryList";
import ProductList from "@/components/structure/pages/Product/List";
import PurchaseOrder from "@/components/structure/pages/Purchase/Order/PurchaseOrder";
import PurchaseQuotation from "@/components/structure/pages/Purchase/Quotation/PurchaseQuotation";
import TypeList from "@/components/structure/pages/Type/TypeList";
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
  | "PurchaseOrder";

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
