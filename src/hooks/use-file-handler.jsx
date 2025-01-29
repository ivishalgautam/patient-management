import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import useLocalStorage from "./use-local-storage";
import { endpoints } from "@/utils/endpoints";
import config from "@/config";

const useFileHandler = () => {
  const [token] = useLocalStorage("token");
  const [image, setImage] = useState(null);

  const uploadFile = async (file, url) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data[0];
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error(error?.response?.data?.message || "File upload failed");
    }
  };

  const deleteFile = async (filePath, setValue, name) => {
    try {
      const deleteUrl = `${config.api_base}${endpoints.files.getFiles}?file_path=${filePath}`;
      await axios.delete(deleteUrl);

      setImage(null);
      typeof setValue === "function" && setValue(name, "");
      return true;
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error(error?.message || "Error deleting image");
      throw error;
    }
  };

  const handleFileChange = async (
    event,
    name, //name is the form name key
    setValue,
    handleUpdate,
    type = "create",
  ) => {
    try {
      const selectedFile = event.target.files[0];
      const uploadUrl = `${process.env.NEXT_PUBLIC_API_URL}${endpoints.files.upload}`;
      const file = await uploadFile(selectedFile, uploadUrl);

      if (image) {
        const deleteUrl = `${process.env.NEXT_PUBLIC_API_URL}${endpoints.files.getFiles}`;
        await deleteFile(image, deleteUrl);
      }
      console.log({ file });
      setImage(file);
      setValue(name, file);

      if (type === "edit") {
        handleUpdate({ [name]: file });
      }
    } catch (error) {
      console.error("Error handling file change:", error);
    }
  };

  return { handleFileChange, deleteFile, image, setImage };
};

export default useFileHandler;
