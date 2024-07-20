import { useEffect, useState } from "react";
import "./App.css";
import Card from "./components/wrappers/Card";
import FileResultTable from "./components/FileResultTable";
import { Data } from "./interfaces/TableData";

import FileUploadForm from "./components/FileUploadForm";
import UpdateTableForm from "./components/UpdateTableForm";

function App() {
  const [parsedFileData, setParsedFileData] = useState<Data[]>([]); // ! the data we used to render the table
  const [highlightColumn, setHighlightColumn] = useState<string>("");

  useEffect(()=>{
    if (highlightColumn === "") return;
    setTimeout(()=>{
      setHighlightColumn("");
    }, 5000)


  }, [highlightColumn])

  return (
    <div className="p-4 bg-[#eff2f6]">
      <h1 className="text-4xl ">Regex matching and replacement</h1>

      <FileUploadForm setParsedFileData={setParsedFileData} />

      <Card className="result-card mt-4">
        <UpdateTableForm
          parsedFileData={parsedFileData}
          setParsedFileData={setParsedFileData}
          setHighlightColumn={setHighlightColumn}
        />

        <div className="h-[1px] bg-slate-900 my-2" />

        <FileResultTable tableData={parsedFileData} highlightColumn={highlightColumn}/>
      </Card>
    </div>
  );
}

export default App;
