import axios from "axios";

const apiPath = "/api/transactions";

const category = {
  apiPathCategory: "/api/account/transactions/categories",
  create: async (name: string, description: string) => {
    const data = { name, description };
    const response = await axios.post(category.apiPathCategory, data);
    return response;
  },
  listAll: async () => {
    const response = await axios.get(category.apiPathCategory);
    return response.data;
  },
  list: (value: string, type: "name" | "id") => {
    const response = axios.get(`${category.apiPathCategory}?${type}=${value}`);
    return response;
  },
  update: async (id: string, name: string, description?: string) => {
    const data = { name, description };
    const response = await axios.patch(
      `${category.apiPathCategory}/${id}`,
      data
    );
    return response;
  },

  delete: async (id: string) => {
    const response = await axios.delete(`${category.apiPathCategory}/${id}`);
    return response;
  },
};

async function list(transactionId: string) {
  const response = await axios.get(`${apiPath}?id=${transactionId}`);
  return response.data;
}

async function listAll() {
  const response = await axios.get(apiPath);
  return response.data;
}

export const transactions = {
  category,
  list,
  listAll,
};
