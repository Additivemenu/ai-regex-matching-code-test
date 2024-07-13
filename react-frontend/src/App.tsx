import React, { useState } from "react";
import "./App.css";
import Card from "./components/wrappers/Card";
import Button from "./components/buttons/Button";
import useFileUpload from "./hooks/useUpload";

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { selectedFile, uploadStatus, handleFileChange, handleUpload } =
    useFileUpload();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // prevent the default refreshing browser behavior on form submit

    setIsLoading(true);
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    await handleUpload();
    setIsLoading(false);
  };

  return (
    <div className="p-4 bg-[#eff2f6]">
      <h1 className="text-4xl ">Regex matching and replacement</h1>

      {/* also need a toast to give feedback after interaction */}
      <Card>
        <form onSubmit={handleSubmit}>
          {/* TODO: encapsulate it as a input field with error prompt */}
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
          <span> {isLoading ? "isLoading" : "not loading"}</span>
          <Button isLoading={isLoading}>upload</Button>
        </form>
      </Card>

      <Card className="mt-4">
        <label htmlFor="user-prompt">
          please specify your prompt:{" "}
          <span className="text-sm">
            (e.g. find the email address in the table and replace it with the
            phone number)
          </span>{" "}
        </label>
        <br />
        <input
          id="user-prompt"
          type="text"
          placeholder="find the email address in the table and replace it with the phone number"
        />

        <div className="h-[1px] bg-slate-900 my-2" />
        <p>
          a div table that displays the data from the file, note even table
          header is dynamic!
        </p>
      </Card>
    </div>
  );
}

export default App;
