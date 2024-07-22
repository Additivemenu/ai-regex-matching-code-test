import { useState } from "react";
import { uploadFileRequest } from "../libs/http";
import { Data } from "../interfaces/TableData";

interface UseFileUploadResult {
  selectedFile: File | null;
  uploadStatus: string;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => Promise<void>;
}

enum FileUploadStatus {
  NO_FILE_SELECTED = "No file selected",
  FILE_UPLOADED_SUCCESSFULLY = "File uploaded successfully!",
  ERROR_UPLOADING_FILE = "Error uploading file",
}

const useFileUpload = (
  setParsedFileData: React.Dispatch<React.SetStateAction<Data[]>>
): UseFileUploadResult => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus(FileUploadStatus.NO_FILE_SELECTED);
      return;
    }

    try {
      const response = await uploadFileRequest(selectedFile);

      if (response.status === 200) {
        // debugger;

        setParsedFileData(JSON.parse(response.data.data)); 
        setUploadStatus(FileUploadStatus.FILE_UPLOADED_SUCCESSFULLY);
      }
    } catch (error) {
      setUploadStatus(FileUploadStatus.ERROR_UPLOADING_FILE);
      throw error;
      
    }
  };

  return {
    selectedFile,
    uploadStatus,
    handleFileChange,
    handleUpload,
  };
};

export default useFileUpload;
