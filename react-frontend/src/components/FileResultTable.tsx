import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
} from "@mui/material";
import Scrollable from "./wrappers/Scrollable";
import { TablePaginationActions } from "./TablePaginationActions";
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

  // pagination hooks and handlers --------------------------------------------
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableData.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // jsx -----------------------------------------------------------------------
  const tableDataToDisplay =
    rowsPerPage > 0
      ? tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : tableData;

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
              {tableDataToDisplay.map((row, index) => (
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
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={3}
                  count={tableData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  slotProps={{
                    select: {
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    },
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </Scrollable>
      )}
      {tableData.length === 0 && <p>No data to display</p>}
    </>
  );
};

export default FileResultTable;
