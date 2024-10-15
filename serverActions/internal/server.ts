import { images } from "./partials/images";

export type SERVER_RESPONSE = {
  status: number;
  message: string;
  data: any;
};

export const SERVER = {
  images,
};
