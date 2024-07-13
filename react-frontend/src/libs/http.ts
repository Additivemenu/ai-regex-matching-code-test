import axios from "axios";
import { Data } from "../interfaces/TableData";

const API_URL = "http://localhost:8000";

export const uploadFileRequest = async (fileToUpload: File) => {
  const url = `${API_URL}/regexapp/api/v1/file`;

  const formData = new FormData();
  formData.append("file", fileToUpload);

  const response = await axios.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

export const updateTableDataRequest = async (
  query: string,
  tableData: Data[]
) => {
  const url = `${API_URL}/regexapp/api/v1/table/natural-language-update`;

  const response = await axios.post(url, {
    query,
    tableData,
  });

  return response;
};
