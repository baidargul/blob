import axios from "axios";

const apiPath = "/api/inventory";

async function list() {
  const response = await axios.get(apiPath);
  return response.data;
}

async function getByBarcode(barcode: string) {
  const response = await axios.get(`${apiPath}/barcode/?barcode=${barcode}`);
  return response.data;
}

async function getByName(name: string) {
  const response = await axios.get(`${apiPath}/name?name=${name}`);
  return response.data;
}

async function getById(inventoryId: string) {
  const response = await axios.get(`${apiPath}/id?inventoryId=${inventoryId}`);
  return response.data;
}

export const Inventory = {
  list,
  getById,
  getByBarcode,
  getByName,
};
