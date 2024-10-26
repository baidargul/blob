import axios from "axios";

async function create() {
  const response = await axios.post("/api/purchase");
  return response.data;
}

export const Purchase = {
  create,
};
