import React, { useEffect, useState } from "react";
import { serverActions } from "@/serverActions/serverActions";
import { formalizeText, formatCurrency } from "@/lib/utils";

const Report = ({ from, to }: { from: Date; to: Date }) => {
  const [sales, setSales] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [groupBy, setGroupBy] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchSalesData = async () => {
      const startDate = from || new Date(Date.now() - 24 * 60 * 60 * 1000); // Default to yesterday
      const endDate = to || new Date(Date.now() + 24 * 60 * 60 * 1000); // Default to tomorrow

      try {
        const response = await serverActions.Reports.Sales.getSales(
          startDate,
          endDate
        );
        const salesData = response.data || [];
        setSales(salesData);

        const totalProfit = salesData.reduce(
          (acc: number, sale: any) => acc + (sale.soldAt - sale.cost),
          0
        );
        setTotalProfit(totalProfit);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, [from, to]);

  const groupSales = (data: any[], groupKey: string | null) => {
    if (!groupKey) return { All: data };

    return data.reduce((groups: Record<string, any[]>, sale: any) => {
      const groupValue =
        groupKey === "customer"
          ? sale.sale?.customer?.name || "Unknown"
          : groupKey === "vendor"
          ? sale.purchase?.account?.vendor?.name || "Unknown"
          : sale[groupKey]?.name || "Unknown";

      if (!groups[groupValue]) groups[groupValue] = [];
      groups[groupValue].push(sale);
      return groups;
    }, {});
  };

  const sortSales = (data: any[], key: string, order: string) => {
    return [...data].sort((a, b) => {
      const getValue = (item: any) =>
        key === "profit" ? item.soldAt - item.cost : item[key] || "";

      const valueA = getValue(a);
      const valueB = getValue(b);

      if (order === "asc")
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
    });
  };

  const renderGroupedSales = () => {
    const groupedData = groupSales(sales, groupBy);

    return Object.entries(groupedData).map(([groupName, groupItems]) => {
      const sortedItems = sortSales(groupItems, sortBy, sortOrder);
      const groupProfit = sortedItems.reduce(
        (acc: number, sale: any) => acc + (sale.soldAt - sale.cost),
        0
      );

      const alreadyRendered: any = [];

      return (
        <div key={groupName} className="p-4 bg-white rounded-lg shadow-md">
          {groupBy && (
            <h3 className="text-xl font-semibold mb-3">
              {`${formalizeText(groupBy)}: ${formalizeText(groupName)}`}
            </h3>
          )}
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Cost</th>
                <th className="border border-gray-300 p-2">Sold At</th>
                <th className="border border-gray-300 p-2">Profit</th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((sale) => {
                const index = alreadyRendered.indexOf(sale.barcodeRegisterId);
                if (index !== -1) {
                  return null;
                }
                alreadyRendered.push(sale.barcodeRegisterId);
                return (
                  <tr key={sale.barcodeRegisterId}>
                    <td className="border border-gray-300 p-2">
                      <div>{sale.name}</div>
                      <div className="text-xs tracking-wide">
                        {sale.barcode}
                      </div>
                    </td>
                    <td className="border border-gray-300 p-2">
                      {formatCurrency(sale.cost)}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {formatCurrency(sale.soldAt)}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {formatCurrency(sale.soldAt - sale.cost)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-2 text-right font-medium">
            ({alreadyRendered.length} items) Group Profit:{" "}
            {formatCurrency(groupProfit)}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="w-full p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sales Report</h1>
        <div className="flex space-x-4">
          <select
            className="p-2 border rounded"
            value={groupBy || ""}
            onChange={(e) => setGroupBy(e.target.value || null)}
          >
            <option value="">No Grouping</option>
            <option value="customer">Group by Customer</option>
            <option value="vendor">Group by Vendor</option>
            <option value="brand">Group by Brand</option>
            <option value="category">Group by Category</option>
            <option value="type">Group by Type</option>
          </select>
          <select
            className="p-2 border rounded"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="cost">Sort by Cost</option>
            <option value="soldAt">Sort by Sold At</option>
            <option value="profit">Sort by Profit</option>
          </select>
          <select
            className="p-2 border rounded"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
      <div className="space-y-6">{renderGroupedSales()}</div>
      <div className="mt-6 text-right text-lg font-bold">
        ({sales.length} items) x Total Profit: {formatCurrency(totalProfit)}
      </div>
    </div>
  );
};

export default Report;
