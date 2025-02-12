import { serverCommands } from "@/SERVER_COMMANDS/serverCommands";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const fromDate = new URL(req.url).searchParams.get("fromDate");
    const toDate = new URL(req.url).searchParams.get("toDate");

    if (!fromDate || !toDate) {
      response.status = 400;
      response.message = "From Date and To Date is required";
      return new Response(JSON.stringify(response));
    }

    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    if (fromDateObj > toDateObj) {
      response.status = 400;
      response.message = "From Date cannot be greater than To Date";
      return new Response(JSON.stringify(response));
    }

    const sales = await serverCommands.reports.sales.getSale(
      fromDateObj,
      toDateObj
    );

    response.status = 200;
    response.message = "Sales found successfully";
    response.data = sales;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}
