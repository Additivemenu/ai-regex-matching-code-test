import React, { useState } from "react";
import Button from "./buttons/Button";
import { Data } from "../interfaces/TableData";
import { updateTableDataRequest } from "../libs/http";
import useToast from "../hooks/useToast";
import { AxiosError } from "axios";

interface IUpdateTableFormProps {
  parsedFileData: Data[];
  setParsedFileData: React.Dispatch<React.SetStateAction<Data[]>>;
  setHighlightColumn: React.Dispatch<React.SetStateAction<string>>;
}

const UpdateTableForm = ({
  parsedFileData,
  setParsedFileData,
  setHighlightColumn,
}: IUpdateTableFormProps) => {
  const { ToastModal, openToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateTableData = async (event: React.FormEvent) => {
    event.preventDefault();

    if (parsedFileData.length === 0) {
      openToast({
        toastMessage: "There is no data in the table, please upload a csv or excel file first!",
        toastLevel: "error",
      });
      return;
    }

    const form = event.target as HTMLFormElement;
    const userPrompt = (
      form.elements.namedItem("user-prompt") as HTMLInputElement
    ).value;
    // alert(userPrompt);
    try {
      setIsLoading(true);
      const response = await updateTableDataRequest(userPrompt, parsedFileData);

      setParsedFileData(response.data.updated_table_data as Data[]);
      setHighlightColumn(response.data.LLM_res.column_name as string);
      openToast({
        toastMessage: "Table updated successfully!",
        toastLevel: "success",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error updating table:", error);
        openToast({
          toastMessage:
            "Error updating table: " + error.response!.data.detail ??
            error.message,
          toastLevel: "error",
        });
      }
    } finally {
      form.reset();
      setIsLoading(false);
    }
  };

  // jsx -----------------------------------------------------------------------
  const samplePromptList = (
    <ul className="text-sm text-slate-400">
      <li>
        note please specify exactly one column name{" "}
        <span className="font-bold">with case sensitivity</span> in the prompt
      </li>
      <ul>
        <li className="text-slate-900">
          for regex matching and replacement query, please specify 'replace:' at
          the start of your prompt
        </li>
        <li>
          (e.g. replace: find the Website column and remove 'http://' and 'https://' at the start)
        </li>
        <li>
          (e.g. replace: find the state column and replace value 'TX' with
          'Texas')
        </li>
      </ul>
      <ul>
        <li className="text-slate-900">
          for data transformation query, please specify 'transform:' at the
          start of your prompt - note only filling missing value and normalize a numerical column is supported {" "}
        </li>
        <li>
          (e.g. transform: fill the missing value with 0 in the Test1 column)
        </li>
        <li>(e.g. transform: normalize Test1 column )</li>
      </ul>
    </ul>
  );

  return (
    <form onSubmit={handleUpdateTableData}>
      <label htmlFor="user-prompt">
        <span className="text-lg">
          Please specify your prompt used to transform or replace value in the
          table:{" "}
        </span>
        {samplePromptList}
      </label>
      <br />
      <input
        id="user-prompt"
        type="text"
        placeholder="replace: find the <column name> in the table and replace the value with <desired value>"
        className="border border-slate-900 p-1 mr-2 w-[50%] overflow-auto"
      />
      <Button isLoading={isLoading}>confirm</Button>
      <ToastModal />
    </form>
  );
};

export default UpdateTableForm;
