import axios from "axios";

async function create(
  name: string,
  phone1: string,
  phone2: string,
  address1: string,
  address2: string,
  description: string
) {
  const data = {
    name,
    phone1,
    phone2,
    address1,
    address2,
    description,
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

export const Brand = {
  create,
  list,
  listAll,
  remove,
  removeAll,
};
