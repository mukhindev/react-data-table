import { ForwardedRef, HTMLAttributes, forwardRef, ReactElement } from "react";
import { ColumnDef } from "../../types";
import DataTableBodyCell from "../DataTableBodyCell";
import DataTableHeadCell from "../DataTableHeadCell";
import styles from "./DataTable.module.css";

interface DataTableProps<T> extends HTMLAttributes<HTMLDivElement> {
  "data-component"?: string;
  /** Определение колонок таблицы */
  defs: ColumnDef<T>[];
  /** Массив данных для вывода. Каждый элемент — строка */
  data: T[];
  table?: ReactElement;
  thead?: ReactElement;
  tbody?: ReactElement;
  tr?: ReactElement;
  td?: ReactElement;
}

/** Генерация таблицы из данных */
export default forwardRef(function DataTable<T>(
  props: DataTableProps<T>,
  ref: ForwardedRef<HTMLDivElement>
) {
  const {
    "data-component": dataComponent,
    data = [],
    defs = [],
    className,
    table,
    thead,
    tbody,
    tr,
    td,
    ...divProps
  } = props;

  if (!data || !defs) {
    return null;
  }

  const Table = table?.type ?? "table";
  const TableHead = thead?.type ?? "thead";
  const TableBody = tbody?.type ?? "tbody";
  const TableRow = tr?.type ?? "tr";

  return (
    <div
      {...divProps}
      data-component={
        dataComponent ? `DataTable/${dataComponent}` : "DataTable"
      }
      className={[styles.DataTable, className].filter((el) => el).join(" ")}
      ref={ref}
    >
      <Table className={styles.Table} {...table?.props}>
        <TableHead {...thead?.props}>
          <TableRow {...tr?.props}>
            {defs.map((def, defIndex) => {
              return <DataTableHeadCell key={defIndex} def={def} td={td} />;
            })}
          </TableRow>
        </TableHead>
        <TableBody {...tbody?.props}>
          {data.map((item, dataIndex) => {
            return (
              <TableRow key={dataIndex} {...tr?.props}>
                {defs.map((def, defIndex) => {
                  return (
                    <DataTableBodyCell
                      key={defIndex}
                      def={def}
                      index={dataIndex}
                      item={item}
                      td={td}
                    />
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
});
