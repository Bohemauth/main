"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useSignTypedData, useUser } from "@privy-io/react-auth";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setProducts } from "@/redux/slice/UserSlice";

export default function useProduct() {
  const router = useRouter();
  const { signTypedData } = useSignTypedData();
  const { user } = useUser();
  const dispatch = useDispatch();

  const createProduct = async (
    uploadedFile,
    name,
    description,
    setIsCreating
  ) => {
    try {
      setIsCreating(true);

      if (!user) {
        toast.error("User not found");
        router.push("/login");
        return;
      }

      const formdata = new FormData();
      formdata.append("image", uploadedFile);

      const uploadResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/product/upload`,
        formdata
      );

      if (!uploadResponse.data.success) {
        toast.error("Failed to upload image");
        return;
      }

      const imageUrl = uploadResponse.data.imageUrl;

      const domain = {
        name: "bohemauth",
        version: "1",
      };

      const types = {
        NewProduct: [
          { name: "name", type: "string" },
          { name: "description", type: "string" },
          { name: "image", type: "string" },
        ],
      };

      const message = {
        name,
        description,
        image: imageUrl,
      };

      const signature = await signTypedData(
        {
          domain,
          types,
          primaryType: "NewProduct",
          message,
        },
        {
          address: user.wallet.address,
        }
      );

      const createProductResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/product/create`,
        {
          name,
          description,
          image: imageUrl,
          address: user.wallet.address,
          signature: signature.signature,
        }
      );

      if (!createProductResponse.data.success) {
        toast.error("Failed to create product");
        return;
      }

      toast.success("Product created successfully");
      await listProducts();
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error("Failed to create product");
    } finally {
      setIsCreating(false);
    }
  };

  const listProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product/list/${user.wallet.address}`
      );
      if (!response.data.success) {
        toast.error("Failed to list products");
        dispatch(setProducts([]));
        return [];
      }
      dispatch(setProducts(response.data.products));
      return response.data.products;
    } catch (error) {
      console.log(error);
      toast.error("Failed to list products");
      dispatch(setProducts([]));
      return [];
    }
  };

  return {
    createProduct,
    listProducts,
  };
}
