import axios from "axios";

export const registerService = async (
  email: string,
  password: string,
  name: string
) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
    { email, password, name }
  );

  return response.data;
};
