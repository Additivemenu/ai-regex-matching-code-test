import React from "react";
import Button from "./buttons/Button";
import { Data } from "../interfaces/TableData";
import { updateTableDataRequest } from "../libs/http";
import useToast from "../hooks/useToast";
import { AxiosError } from "axios";

interface IUpdateTableFormProps {
  parsedFileData: Data[];
  setParsedFileData: React.Dispatch<React.SetStateAction<Data[]>>;
}

const UpdateTableForm = ({
  parsedFileData,
  setParsedFileData,
}: IUpdateTableFormProps) => {
  const { ToastModal, openToast } = useToast();

  const handleUpdateTableData = async (event: React.FormEvent) => {
    event.preventDefault();

    if (parsedFileData.length === 0) {
      openToast({
        toastMessage: "Please upload a file first!",
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
      const response = await updateTableDataRequest(userPrompt, parsedFileData);

      setParsedFileData(response.data.updated_table_data as Data[]);
      openToast({
        toastMessage: "Table updated successfully!",
        toastLevel: "success",
      });
    } catch (error) {
      // FIXME: how to display detailed error message?
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
    }
  };

  return (
    <form onSubmit={handleUpdateTableData}>
      <label htmlFor="user-prompt">
        <span className="text-lg">
          Please specify your prompt used to transform or replace value in the
          table:{" "}
        </span>
        <ul className="text-sm text-slate-400">
          <li>
            note please specify exactly one column name with case sensitivity in
            the prompt
          </li>
          <li>
            (e.g. replace: find the Email address in the table and replace it with the
            'regex' )
          </li>
          <li>
            (e.g. replace: find the state column and replace value 'TX' with 'Texas')
          </li>
        </ul>
      </label>
      <br />
      <input
        id="user-prompt"
        type="text"
        placeholder="find the <column name> in the table and replace the value with <desired value>"
        className="border border-slate-900 p-1 mr-2 w-[50%] overflow-auto"
      />
      <Button>confirm</Button>
      <ToastModal />
    </form>
  );
};

export default UpdateTableForm;
