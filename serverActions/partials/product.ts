import axios from "axios";

async function listAll() {
  const response = await axios.get("/api/product");
  return response.data;
}

async function list(id: string) {
  const response = await axios.get(`/api/product/${id}`);
  return response.data;
}

async function findByName(name: string) {}

async function findByBarcode(barcode: string) {}

async function removeAll() {
  const response = await axios.delete("/api/product");
  return response.data;
}

async function remove(id: string) {
  const response = await axios.delete(`/api/product/x?id=${id}`);
  return response.data;
}

async function create(
  name: string,
  cost: number,
  price: number,
  images?: string[]
) {
  const data = {
    name,
    cost,
    price,
    images,
  };

  const resposne = await axios.post("/api/product", data);
  return resposne.data;
}

export const product = {
  create,
  remove,
  removeAll,
  list,
  listAll,
  findByName,
  findByBarcode,
};
