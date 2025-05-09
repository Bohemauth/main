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

  const getProduct = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product/get/${id}`
      );
      if (!response.data.success) {
        toast.error("Failed to get product");
        return null;
      }
      return response.data.product;
    } catch (error) {
      console.log(error);
      toast.error("Failed to get product");
      return null;
    }
  };

  const editProduct = async (id, name, description, isUpdating) => {
    try {
      isUpdating(true);

      if (!id || !name || !description) {
        toast.error("Missing required fields");
        return;
      }

      const domain = {
        name: "bohemauth",
        version: "1",
      };

      const types = {
        EditProduct: [
          { name: "id", type: "string" },
          { name: "name", type: "string" },
          { name: "description", type: "string" },
        ],
      };

      const message = {
        id,
        name,
        description,
      };

      const signature = await signTypedData(
        {
          domain,
          types,
          primaryType: "EditProduct",
          message,
        },
        {
          address: user.wallet.address,
        }
      );

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/product/edit`,
        {
          id,
          name,
          description,
          signature: signature.signature,
          address: user.wallet.address,
        }
      );

      if (!response.data.success) {
        toast.error("Failed to edit product");
        return;
      }
      toast.success("Product edited successfully");
      await listProducts();
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error("Failed to edit product");
    } finally {
      isUpdating(false);
    }
  };

  const launchProduct = async (id, isLaunching, setIsOpen) => {
    try {
      isLaunching(true);

      if (!id) {
        toast.error("Missing required fields");
        return;
      }

      const domain = {
        name: "bohemauth",
        version: "1",
      };

      const types = {
        LaunchProduct: [{ name: "id", type: "string" }],
      };

      const message = {
        id,
      };

      const signature = await signTypedData(
        {
          domain,
          types,
          primaryType: "LaunchProduct",
          message,
        },
        {
          address: user.wallet.address,
        }
      );

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/product/launch/${id}`,
        {
          signature: signature.signature,
          address: user.wallet.address,
        }
      );

      if (!response.data.success) {
        toast.error("Failed to launch product");
        return;
      }
      await listProducts();

      setIsOpen(false);

      toast.success("Product Added to Queue");
    } catch (error) {
      console.log(error);
      toast.error("Failed to launch product");
    } finally {
      isLaunching(false);
    }
  };

  const createListing = async (id, isCreating) => {
    try {
      isCreating(true);

      if (!id) {
        toast.error("Missing required fields");
        return;
      }

      const domain = {
        name: "bohemauth",
        version: "1",
      };

      const types = {
        AddListing: [{ name: "productId", type: "string" }],
      };

      const message = {
        productId: id,
      };

      const signature = await signTypedData(
        {
          domain,
          types,
          primaryType: "AddListing",
          message,
        },
        {
          address: user.wallet.address,
        }
      );

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/listing/add`,
        {
          productId: id,
          signature: signature.signature,
          address: user.wallet.address,
        }
      );

      if (!response.data.success) {
        toast.error("Failed to create listing");
        return;
      }
      toast.success("Listing created successfully");

      return response.data;
    } catch (error) {
      console.log(error);
      toast.error("Failed to create listing");
    } finally {
      isCreating(false);
    }
  };

  const getAllListings = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/listing/getAll/${id}`
      );
      if (!response.data.success) {
        toast.error("Failed to get listings");
        return [];
      }
      return response.data.listings;
    } catch (error) {
      console.log(error);
      toast.error("Failed to get listings");
      return [];
    }
  };

  const validateProduct = async (listingId, proofId) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/listing/validate`,
        {
          listingId,
          proofId: proofId ? proofId : "dummy",
        }
      );

      if (!response.data.success) {
        toast.error("Failed to validate product");
        return;
      }
      if (response.data.isValid) {
        toast.success("Product validated successfully");
      }
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error("Failed to validate product");
    }
  };

  return {
    createProduct,
    listProducts,
    getProduct,
    editProduct,
    launchProduct,
    createListing,
    getAllListings,
    validateProduct,
  };
}
