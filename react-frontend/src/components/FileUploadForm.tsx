import React, { useState } from "react";
import Card from "./wrappers/Card";
import Button from "./buttons/Button";
import useFileUpload from "../hooks/useUpload";
import { Data } from "../interfaces/TableData";
import useToast from "../hooks/useToast";
import { AxiosError } from "axios";

interface IFileUploadFormProps {
  setParsedFileData: React.Dispatch<React.SetStateAction<Data[]>>;
}

const FileUploadForm = ({ setParsedFileData }: IFileUploadFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { ToastModal, openToast } = useToast();

  // const [parsedFileData, setParsedFileData] = useState<Data[]>([]); // ! the data we used to render the table
  const { selectedFile, uploadStatus, handleFileChange, handleUpload } =
    useFileUpload(setParsedFileData);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // prevent the default refreshing browser behavior on form submit

    if (!selectedFile) {
      openToast({
        toastMessage: "Please select a file to upload",
        toastLevel: "error",
      });
      return;
    }

    try {
      setIsLoading(true);
      await handleUpload();

      openToast({
        toastMessage: "File uploaded successfully!",
        toastLevel: "success",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        openToast({
          toastMessage: "Error uploading file: " + error!.response!.data.detail,
          toastLevel: "error",
        });
      } else if (error instanceof Error) {
        openToast({
          toastMessage: "Error uploading file: " + error.message,
          toastLevel: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="fileUpload-card">
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label htmlFor="file-upload">
            please upload a csv or excel file for processing
          </label>
          <br />
          <input
            id="file-upload"
            type="file"
            accept=".csv, .xls, .xlsx"
            onChange={handleFileChange}
          />
        </div>
        <Button isLoading={isLoading}>upload</Button>
      </form>
      <ToastModal />
    </Card>
  );
};

export default FileUploadForm;
