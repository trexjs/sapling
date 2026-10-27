import React from "react";
import styled from "@emotion/styled";
import { XloxTheme } from "../../theme/types";

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
}

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const StyledTable = styled.table<{ striped?: boolean; hoverable?: boolean; bordered?: boolean }>`
  width: 100%;
  border-collapse: collapse;
  font-family: ${(props) => (props.theme as XloxTheme).typography.fontFamily};
  font-size: ${(props) => (props.theme as XloxTheme).typography.body2.fontSize};
  
  ${(props) => props.bordered && `
    border: 1px solid ${(props.theme as XloxTheme).colors.neutral[200]};
  `}
`;

const TableHead = styled.thead`
  background-color: ${(props) => (props.theme as XloxTheme).colors.neutral[50]};
  border-bottom: 2px solid ${(props) => (props.theme as XloxTheme).colors.neutral[200]};
`;

const TableBody = styled.tbody<{ striped?: boolean; hoverable?: boolean }>`
  ${(props) => props.striped && `
    tr:nth-of-type(even) {
      background-color: ${(props.theme as XloxTheme).colors.neutral[50]};
    }
  `}
  
  ${(props) => props.hoverable && `
    tr:hover {
      background-color: ${(props.theme as XloxTheme).colors.neutral[100]};
    }
  `}
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${(props) => (props.theme as XloxTheme).colors.neutral[200]};
`;

const TableHeader = styled.th`
  padding: ${(props) => `${(props.theme as XloxTheme).spacing(1.5)} ${(props.theme as XloxTheme).spacing(2)}`};
  text-align: left;
  font-weight: ${(props) => (props.theme as XloxTheme).typography.subtitle2.fontWeight};
  color: ${(props) => (props.theme as XloxTheme).colors.text.primary};
`;

const TableCell = styled.td`
  padding: ${(props) => `${(props.theme as XloxTheme).spacing(1.5)} ${(props.theme as XloxTheme).spacing(2)}`};
  color: ${(props) => (props.theme as XloxTheme).colors.text.primary};
`;

export const Table: React.FC<TableProps> & {
  Head: typeof TableHead;
  Body: typeof TableBody;
  Row: typeof TableRow;
  Header: typeof TableHeader;
  Cell: typeof TableCell;
} = ({ children, striped = false, hoverable = false, bordered = false, ...props }) => {
  return (
    <TableContainer>
      <StyledTable striped={striped} hoverable={hoverable} bordered={bordered} {...props}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === TableBody) {
            return React.cloneElement(child, { striped, hoverable } as any);
          }
          return child;
        })}
      </StyledTable>
    </TableContainer>
  );
};

Table.Head = TableHead;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Header = TableHeader;
Table.Cell = TableCell;

Table.displayName = "Table";
TableHead.displayName = "Table.Head";
TableBody.displayName = "Table.Body";
TableRow.displayName = "Table.Row";
TableHeader.displayName = "Table.Header";
TableCell.displayName = "Table.Cell";
