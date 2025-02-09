import { serverCommands } from "@/SERVER_COMMANDS/serverCommands";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const response: any = {
    status: 500,
    message: "Internal Server Error",
    data: null,
  };

  try {
    // Helper function to reset time to start of the day (00:00:00.000)
    const resetToStartOfDay = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    // Calculate date ranges
    const today = new Date();
    const startOfToday = resetToStartOfDay(today);

    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    const startOfDayBeforeYesterday = new Date(startOfToday);
    startOfDayBeforeYesterday.setDate(startOfDayBeforeYesterday.getDate() - 2);

    // Fetch sales data for each day
    const [todayData, yesterdayData, dayBeforeYesterdayData] =
      await Promise.all([
        serverCommands.reports.sales.getSale(startOfToday, startOfTomorrow),
        serverCommands.reports.sales.getSale(startOfYesterday, startOfToday),
        serverCommands.reports.sales.getSale(
          startOfDayBeforeYesterday,
          startOfYesterday
        ),
      ]);

    // Format the data
    const formattedData = {
      today: formatSalesData(todayData),
      yesterday: formatSalesData(yesterdayData),
      dayBeforeYesterday: formatSalesData(dayBeforeYesterdayData),
    };

    // Build and return success response
    response.status = 200;
    response.message = "Data fetched successfully";
    response.data = formattedData;
    return new Response(JSON.stringify(response), { status: response.status });
  } catch (error: any) {
    // Handle and log errors
    console.error("[SERVER ERROR]:", error.message);
    response.message = error.message;
    return new Response(JSON.stringify(response), { status: response.status });
  }
}

// Helper function to format sales data
const formatSalesData = (data: any) => {
  let totalSales = 0;
  let totalWorth = 0;

  for (const item of data) {
    totalSales += Number(item.soldAt || 0);
    totalWorth += Number(item.cost || 0);
  }

  return {
    sales: totalSales,
    cost: totalWorth,
    profit: totalSales - totalWorth,
  };
};
