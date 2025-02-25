import { HTMLAttributes, ReactElement, ReactNode } from "react";
import { ColumnDef } from "../../types";
import styles from "./DataTableBodyCell.module.css";

interface DataTableBodyCellProps<T>
  extends HTMLAttributes<HTMLTableCellElement> {
  /** Определение колонки (свойства колонки) */
  def: ColumnDef<T>;
  /** Данные строки таблицы */
  item: T;
  index: number;
  td?: ReactElement;
}

export default function DataTableBodyCell<T>(props: DataTableBodyCellProps<T>) {
  const { def, item, index, className, td } = props;

  const withTdWrapperElement = (element: ReactNode) => {
    const {
      "data-component": dataComponent,
      className: defClassName,
      ...cellProps
    } = {
      ...def.cellProps,
      ...def.bodyCellProps,
      style: { ...def.cellProps?.style, ...def.bodyCellProps?.style },
      className: [def.cellProps?.className, def.bodyCellProps?.className]
        .filter((el) => el)
        .join(" "),
    };

    const TableCell = td?.type ?? "td";

    return (
      <TableCell
        data-component={
          dataComponent
            ? `DataTableBodyCell/${dataComponent}`
            : "DataTableBodyCell"
        }
        className={[styles.root, className, defClassName]
          .filter((el) => el)
          .join(" ")}
        {...td?.props}
        {...cellProps}
      >
        {element}
      </TableCell>
    );
  };

  if (def.render) {
    return withTdWrapperElement(def.render(props.item, index));
  }

  const value =
    def.valueKey && getValueFromObject(item, def.valueKey as string);

  if (
    value === undefined ||
    value === null ||
    typeof value === "string" ||
    typeof value === "number"
  ) {
    return withTdWrapperElement(value);
  }
}

function getValueFromObject(obj: unknown, key: string): unknown {
  if (obj === null || obj === undefined) {
    return undefined;
  }

  if (!key.includes(".")) {
    return obj[key as keyof typeof obj];
  }

  const paths = key.split(".");

  return paths.reduce((acc, key) => acc?.[key as keyof typeof acc], obj);
}
