import axios from "axios";

const apiPath = "/api/reports/sales";

async function getSales(fromDate: Date, toDate: Date) {
  const response = await axios.get(
    `${apiPath}?fromDate=${fromDate}&toDate=${toDate}`
  );
  return response.data;
}

export const Sales = {
  getSales,
};
