import React, { useState } from "react";
import "./App.css";
import Card from "./components/wrappers/Card";
import Button from "./components/buttons/Button";
import useFileUpload from "./hooks/useUpload";
import FileResultTable from "./components/FileResultTable";
import { Data } from "./interfaces/TableData";
import { updateTableDataRequest } from "./libs/http";

const MOCK_DATA = [
  {
    IATA: "ABQ",
    airport: "Albuquerque International",
    city: "Albuquerque",
    state: "NM",
    country: "USA",
    latitude: 35.04022222,
    longitude: -106.6091944,
  },
  {
    IATA: "ANC",
    airport: "Ted Stevens Anchorage International",
    city: "Anchorage",
    state: "AK",
    country: "USA",
    latitude: 61.17432028,
    longitude: -149.9961856,
  },
  {
    IATA: "ATL",
    airport: "William B Hartsfield-Atlanta Intl",
    city: "Atlanta",
    state: "GA",
    country: "USA",
    latitude: 33.64044444,
    longitude: -84.42694444,
  },
  {
    IATA: "AUS",
    airport: "Austin-Bergstrom International",
    city: "Austin",
    state: "TX",
    country: "USA",
    latitude: 30.19453278,
    longitude: -97.66987194,
  },
];

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [parsedFileData, setParsedFileData] = useState<Data[]>([]); // ! the data we used to render the table
  const { selectedFile, uploadStatus, handleFileChange, handleUpload } =
    useFileUpload(setParsedFileData);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // prevent the default refreshing browser behavior on form submit

    setIsLoading(true);
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    await handleUpload();

    setIsLoading(false);
  };

  const handleUpdateTableData = async (event: React.FormEvent) => {
    event.preventDefault();

    if (parsedFileData.length === 0) {
      alert("please upload a file first");
      return;
    }

    const form = event.target as HTMLFormElement;
    const userPrompt = (
      form.elements.namedItem("user-prompt") as HTMLInputElement
    ).value;
    // alert(userPrompt);
    try {
      await updateTableDataRequest(userPrompt, parsedFileData);
    } catch (error) {
      console.error("error: ", error);
    } finally {
      form.reset();
    }
  };

  return (
    <div className="p-4 bg-[#eff2f6]">
      <h1 className="text-4xl ">Regex matching and replacement</h1>

      {/* also need a toast to give feedback after interaction */}
      <Card className="fileUpload-card">
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

      <Card className="result-card mt-4">
        <form onSubmit={handleUpdateTableData}>
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
            className="border border-slate-900 p-1 mr-2 w-[50%]"
          />
          <Button>confirm</Button>
        </form>

        <div className="h-[1px] bg-slate-900 my-2" />

        <FileResultTable tableData={parsedFileData} />
      </Card>
    </div>
  );
}

export default App;
