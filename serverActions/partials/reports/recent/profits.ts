import axios from "axios";

const apiPath = "/api/reports/profits/recent";

async function getSales() {
  const response = await axios.get(`${apiPath}`);
  return response.data;
}

export const RecentProfits = {
  getSales,
};
