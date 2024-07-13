import axios from "axios";

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
