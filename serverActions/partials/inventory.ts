import axios from "axios";

const apiPath = "/api/inventory";

async function list() {
  const response = await axios.get(apiPath);
  return response.data;
}

async function getByBarcode(barcode: string) {
  const response = await axios.get(`${apiPath}/${barcode}?id=${barcode}`);
  return response.data;
}

export const Inventory = {
  list,
  getByBarcode,
};
