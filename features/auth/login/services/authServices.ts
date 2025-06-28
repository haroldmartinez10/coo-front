import axios from "axios";

export const authServices = {
  login: async (email: string, password: string) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
      { email, password }
    );

    return response.data;
  },
};
