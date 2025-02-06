import { serverCommands } from "@/SERVER_COMMANDS/serverCommands";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const today = new Date();

    // Create separate Date instances for today, yesterday, and the day before yesterday
    const startOfToday = new Date(today);
    const startOfTomorrow = new Date(today);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    const startOfYesterday = new Date(today);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    const startOfDayBeforeYesterday = new Date(today);
    startOfDayBeforeYesterday.setDate(startOfDayBeforeYesterday.getDate() - 2);

    // Fetch data for each day using distinct Date objects
    const todayData = await serverCommands.reports.sales.getSale(
      startOfToday,
      startOfTomorrow
    );

    const yesterdayData = await serverCommands.reports.sales.getSale(
      startOfYesterday,
      startOfToday
    );

    const dayBeforeYesterdayData = await serverCommands.reports.sales.getSale(
      startOfDayBeforeYesterday,
      startOfYesterday
    );

    // Format the data
    const todaySales = format(todayData);
    const yesterdaySales = format(yesterdayData);
    const dayBeforeYesterdaySales = format(dayBeforeYesterdayData);

    // Build the response
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
