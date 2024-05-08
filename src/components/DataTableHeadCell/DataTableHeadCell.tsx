import { HTMLAttributes, ReactElement } from "react";
import { ColumnDef } from "../../types";
import styles from "./DataTableHaedCell.module.css";

interface DataTableHeadCellProps<T>
  extends HTMLAttributes<HTMLTableCellElement> {
  /** Определение колонки (свойства колонки) */
  def: ColumnDef<T>;
  td?: ReactElement;
}

export default function DataTableHeadCell<T>(props: DataTableHeadCellProps<T>) {
  const { def, className, td } = props;
  const {
    "data-component": dataComponent,
    className: defClassName,
    ...cellProps
  } = {
    ...def.cellProps,
    ...def.headCellProps,
    style: { ...def.cellProps?.style, ...def.headCellProps?.style },
    className: [def.cellProps?.className, def.headCellProps?.className]
      .filter((el) => el)
      .join(" "),
  };

  const TableCell = td?.type ?? "td";

  return (
    <TableCell
      data-component={
        dataComponent
          ? `DataTableHeadCell/${dataComponent}`
          : "DataTableHeadCell"
      }
      className={[styles.HeadCell, className, defClassName]
        .filter((el) => el)
        .join(" ")}
      {...td?.props}
      {...cellProps}
    >
      {def.title ?? (def.valueKey as string)}
    </TableCell>
  );
}
