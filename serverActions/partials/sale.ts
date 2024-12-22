import axios from "axios";
import { SERVER_RESPONSE } from "../internal/server";

const API_PATH = "/api/sale";

async function create() {
  const response: SERVER_RESPONSE = await axios.post(`${API_PATH}`);
  return response.data;
}

export const Sale = {
  create,
};
