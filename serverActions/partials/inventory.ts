import axios from "axios";

const apiPath = "/api/inventory";

async function list() {
  const response = await axios.get(apiPath);
  return response.data;
}

export const Inventory = {};
