"use client";
import React, { useEffect } from "react";
import ProductList from "./pages/Product/List";
import { usePageStore } from "@/states/usePage";

type Props = {};

const ContentArea = (props: Props) => {
  const pageHook = usePageStore();

  const currentPage = pageHook.page;

  useEffect(() => {
    pageHook.setPage("ListAllCustomers");
  }, []);

  return (
    <div>
      <div className="">{currentPage?.page}</div>
    </div>
  );
};

export default ContentArea;
