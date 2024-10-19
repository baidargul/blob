import ProductList from "@/components/structure/pages/Product/List";
import PurchaseQuotation from "@/components/structure/pages/Purchase/Quotation/PurchaseQuotation";
import { create } from "zustand";

type PageState = {
  id?: number;
  name: string;
  description?: string;
  page: React.ReactNode;
} | null;

type PageName = "Home" | "ProductList" | "PurchaseQuotation";

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
