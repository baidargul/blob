import prisma from "@/lib/prisma";
import { serverCommands } from "@/SERVER_COMMANDS/serverCommands";
import { PRODUCT_FORMAT_FOR_REPORT } from "@/serverActions/internal/partials/reports";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const today = new Date();
    const todayData = await serverCommands.reports.sales.getSale(
      new Date(today),
      new Date(new Date(today).setDate(today.getDate() + 1))
    );

    const yesterdayData = await serverCommands.reports.sales.getSale(
      new Date(new Date(today).setDate(today.getDate() - 1)),
      new Date(new Date(today).setDate(today.getDate()))
    );

    const dayBeforeYesterdayData = await serverCommands.reports.sales.getSale(
      new Date(new Date(today).setDate(today.getDate() - 2)),
      new Date(new Date(today).setDate(today.getDate() - 1))
    );

    const todaySales = format(todayData);
    const yesterdaySales = format(yesterdayData);
    const dayBeforeYesterdaySales = format(dayBeforeYesterdayData);

    response.status = 200;
    response.message = "Data fetched successfully";
    response.data = {
      today: todaySales,
      yesterday: yesterdaySales,
      dayBeforeYesterday: dayBeforeYesterdaySales,
    };
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

const format = (data: any) => {
  let totalSales = 0;
  let totalWorth = 0;
  let totalProfit = 0;

  for (const item of data) {
    totalSales = Number(totalSales) + Number(item.soldAt);
    totalWorth = Number(totalWorth) + Number(item.cost);
  }

  totalProfit = Number(totalSales) - Number(totalWorth);
  return {
    sales: totalSales,
    cost: totalWorth,
    profit: totalProfit,
  };
};
