import React, { useEffect, useState } from "react";
import { serverActions } from "@/serverActions/serverActions";

// Reusable components
const Row = ({ children, className = "" }: any) => (
  <div className={`flex ${className}`}>{children}</div>
);

const Column = ({ children, className = "" }: any) => (
  <div className={`flex flex-col ${className}`}>{children}</div>
);

const Group = ({ title, children, className = "" }: any) => (
  <div className={`p-4 border rounded-lg shadow-sm ${className}`}>
    <h3 className="font-bold mb-2 text-lg">{title}</h3>
    {children}
  </div>
);

const Report = () => {
  const [sales, setSales] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [groupBy, setGroupBy] = useState("customer");

  const fetchSales = async () => {
    const todayDate = new Date();
    todayDate.setDate(todayDate.getDate() - 1);
    const tommorrowDate = new Date();
    tommorrowDate.setDate(tommorrowDate.getDate() + 1);

    const response = await serverActions.Reports.Sales.getSales(
      todayDate,
      tommorrowDate
    );
    calculateTotalProfit(response.data);
    setSales(response.data);
  };

  const groupData = (data: any, key: any) => {
    if (groupBy === "customer") {
      return data.reduce((acc: any, item: any) => {
        const groupKey = item.sale[key]?.name || "Unknown";
        if (!acc[groupKey]) acc[groupKey] = [];
        acc[groupKey].push(item);
        return acc;
      }, {});
    } else if (groupBy === "vendor") {
      return data.reduce((acc: any, item: any) => {
        const groupKey = item.purchase.account.vendor.name || "Unknown";
        if (!acc[groupKey]) acc[groupKey] = [];
        acc[groupKey].push(item);
        return acc;
      }, {});
    } else if (groupBy === "brand") {
      return data.reduce((acc: any, item: any) => {
        const groupKey = item.brand.name || "Unknown";
        if (!acc[groupKey]) acc[groupKey] = [];
        acc[groupKey].push(item);
        return acc;
      }, {});
    } else if (groupBy === "category") {
      return data.reduce((acc: any, item: any) => {
        const groupKey = item.category.name || "Unknown";
        if (!acc[groupKey]) acc[groupKey] = [];
        acc[groupKey].push(item);
        return acc;
      }, {});
    } else if (groupBy === "type") {
      return data.reduce((acc: any, item: any) => {
        const groupKey = item.type.name || "Unknown";
        if (!acc[groupKey]) acc[groupKey] = [];
        acc[groupKey].push(item);
        return acc;
      }, {});
    }
  };

  const calculateTotalProfit = (saleData: any) => {
    let profit = 0;

    saleData.forEach((sale: any) => {
      const profitPerSale = Number(sale.soldAt) - Number(sale.cost);
      profit += profitPerSale;
    });

    setTotalProfit(profit);
  };

  const renderGroupedData = () => {
    const groupedData = groupData(sales, groupBy);
    return Object.entries(groupedData).map(([group, items]: any) => {
      let total = 0;
      return (
        <>
          <Group key={group} title={`${groupBy.toUpperCase()}: ${group}`}>
            <Column>
              {items.map((sale: any) => {
                const profitPerSale = Number(sale.soldAt) - Number(sale.cost);
                total += profitPerSale;

                return (
                  <Row
                    key={sale.id}
                    className="justify-between font-sans p-2 border-b last:border-none"
                  >
                    <span>{sale.name}</span>
                    <span className="text-gray-500">{sale.cost}</span>
                    <span className="text-gray-500">{sale.soldAt}</span>
                    <span className="text-gray-500">{profitPerSale}</span>
                  </Row>
                );
              })}
            </Column>
          </Group>
          <div className="text-right font-sans">Net profit: {total}</div>
        </>
      );
    });
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div className="w-full h-full bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sales Report</h1>
        <select
          className="p-2 border rounded"
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value)}
        >
          <option value="customer">Group by Customer</option>
          <option value="vendor">Group by Vendor</option>
          <option value="brand">Group by Brand</option>
          <option value="category">Group by Category</option>
          <option value="type">Group by Type</option>
        </select>
      </div>
      <div className="space-y-4">{renderGroupedData()}</div>
      <div className="text-right font-sans text-lg font-semibold">
        Profit: {totalProfit}
      </div>
    </div>
  );
};

export default Report;
