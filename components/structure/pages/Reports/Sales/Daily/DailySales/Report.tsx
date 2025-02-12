import { serverActions } from "@/serverActions/serverActions";
import React, { useEffect, useState } from "react";

type Props = {};

const Report = (props: Props) => {
  const [sales, setSales] = useState([]);

  const fetchSales = async () => {
    const response = await serverActions.Reports.RecentProfits.getSales();
    console.log(response.data);
    setSales(response.data);
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div className="w-full h-full bg-white">
      <div></div>
    </div>
  );
};

export default Report;
