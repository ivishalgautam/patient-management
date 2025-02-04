import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import useLocalStorage from "./use-local-storage";
import { endpoints } from "@/utils/endpoints";
import config from "@/config";

const useMultiFileHandler = (key) => {
  const [token] = useLocalStorage("token");
  const [images, setImages] = useState(
    localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [],
  );

  useEffect(() => {
    if (images.length) {
      localStorage.setItem(key, JSON.stringify(images));
    } else {
      localStorage.removeItem(key);
    }
  }, [images, key]);

  const uploadFiles = async (files, url) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("file", file);
      });

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.setItem(key, JSON.stringify([...response.data, ...images]));
      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error(error?.response?.data?.message || "File upload failed");
    }
  };

  const deleteFile = async (filePath) => {
    try {
      const deleteUrl = `${process.env.NEXT_PUBLIC_DRDIPTI_API_URL}${endpoints.files.getFiles}?file_path=${filePath}`;
      await axios.delete(deleteUrl);

      setImages((prev) => prev.filter((image) => image !== filePath));
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error(error?.message || "Error deleting image");
      throw error;
    }
  };

  const handleFileChange = async (
    event,
    name, // name is the form name key
    setValue,
    handleUpdate,
    type = "create",
  ) => {
    try {
      const selectedFiles = Array.from(event.target.files);
      const uploadUrl = `${config.api_base}${endpoints.files.upload}`;

      const uploadedFiles = await uploadFiles(selectedFiles, uploadUrl);

      setImages((prev) => [...prev, ...uploadedFiles]);
      setValue(name, [...(images || []), ...uploadedFiles]);

      if (type === "edit") {
        handleUpdate({
          [name]: [...(images || []), ...uploadedFiles],
        });
      }
    } catch (error) {
      console.error("Error handling file change:", error);
    }
  };

  return { handleFileChange, deleteFile, images, setImages };
};

export default useMultiFileHandler;
