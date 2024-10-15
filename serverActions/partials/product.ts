import axios from "axios";

async function listAll() {}

async function list() {}

async function findByName(name: string) {}

async function findByBarcode(barcode: string) {}

async function create(name: string, cost: number, price: number) {
  const data = {
    name,
    cost,
    price,
  };

  const resposne = await axios.post("/api/product", data);
  return resposne.data;
}

export const product = {
  listAll,
  list,
  findByName,
  findByBarcode,
};
