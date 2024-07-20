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
  highlightColumn: string;
}

const FileResultTable = ({
  tableData,
  highlightColumn,
}: FileResultTableProps) => {
  // Extract the keys from the first object to dynamically create table headers
  const headers = tableData.length > 0 ? Object.keys(tableData[0]) : [];

  console.log("tableData: ", tableData);
  if (tableData.length > 0) {
    console.log("tableData length bigger than 0");
  }

  // const highlightColumn = "country";

  return (
    <>
      <h2>table:</h2>
      {tableData.length > 0 && (
        <Scrollable>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableCell
                    key={header}
                    style={{
                      backgroundColor:
                        header === highlightColumn ? "yellow" : "inherit",
                      transition: "background-color 2s ease",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                // since we don't add or delete columns, we can safely use the index as the key
                <TableRow key={index}>
                  {headers.map((header) => (
                    <TableCell
                      key={index + header}
                      style={{
                        backgroundColor:
                          header === highlightColumn ? "yellow" : "inherit",
                        transition: "background-color 2s ease",
                      }}
                    >
                      {row[header]}
                    </TableCell>
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
