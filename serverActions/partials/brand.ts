import axios from "axios";

async function create(
  name: string,
  description: string,
  address1: string,
  address2: string,
  phone1: string,
  phone2: string
) {
  const data = {
    name,
    description,
    address1,
    address2,
    phone1,
    phone2,
  };
  const response = await axios.post("/api/brand", data);
  return response.data;
}

async function list(id: string) {
  const response = await axios.get(`/api/brand/${id}`);
  return response.data;
}

async function listAll() {
  const response = await axios.get("/api/brand");
  return response.data;
}

async function remove(id: string) {
  const response = await axios.delete(`/api/brand/x?id=${id}`);
  return response.data;
}

async function removeAll() {
  const response = await axios.delete("/api/brand");
  return response.data;
}

export const brand = {
  create,
  list,
  listAll,
  remove,
  removeAll,
};
