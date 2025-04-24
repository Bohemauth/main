"use client";

import axios from "axios";
import { useDispatch } from "react-redux";
import { setClaims } from "@/redux/slice/UserSlice";

export default function useUser() {
  const dispatch = useDispatch();
  const getUser = async (address) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/get/${address}`
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    if (!response.data.user) {
      return false;
    }

    return response.data.user;
  };

  const createUser = async (address, name, description, role, signature) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/user/create`,
      {
        address,
        name,
        description,
        role,
        signature,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.user;
  };

  const getUserClaims = async (address) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/claim/get/${address}`
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    console.log(response.data);

    dispatch(setClaims(response.data.claims));

    return response.data.claims;
  };

  return { getUser, createUser, getUserClaims };
}
