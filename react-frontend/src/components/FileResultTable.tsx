import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Scrollable from "./wrappers/Scrollable";
import { v4 as uuidv4 } from "uuid";

import { Data } from "../interfaces/TableData";

interface FileResultTableProps {
  tableData: Data[];
}

const FileResultTable = ({ tableData }: FileResultTableProps) => {
  // Extract the keys from the first object to dynamically create table headers
  const keys = tableData.length > 0 ? Object.keys(tableData[0]) : [];

  console.log("tableData: ", tableData);
  if (tableData.length > 0) {
    console.log("tableData length bigger than 0");
  }

  return (
    <>
      <h2>table:</h2>
      {tableData.length > 0 && (
        <Scrollable>
          <Table>
            <TableHead>
              <TableRow>
                {keys.map((key) => (
                  <TableCell key={key}>{key}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row) => (
                <TableRow key={uuidv4()}>
                  {keys.map((key) => (
                    <TableCell key={key}>{row[key]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Scrollable>
      )}
      {tableData.length === 0 && <p>No data to display</p>}
    </>
  );
};

export default FileResultTable;
