import {
  ForwardedRef,
  HTMLAttributes,
  ReactNode,
  forwardRef,
  ReactElement,
} from "react";
import styles from "./DataTable.module.css";
import { ColumnDef } from "../../types";

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

interface DataTableHeadCellProps<T>
  extends HTMLAttributes<HTMLTableCellElement> {
  /** Определение колонки (свойства колонки) */
  def: ColumnDef<T>;
  td?: ReactElement;
}

function DataTableHeadCell<T>(props: DataTableHeadCellProps<T>) {
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

interface DataTableBodyCellProps<T>
  extends HTMLAttributes<HTMLTableCellElement> {
  /** Определение колонки (свойства колонки) */
  def: ColumnDef<T>;
  /** Данные строки таблицы */
  item: T;
  index: number;
  td?: ReactElement;
}

function DataTableBodyCell<T>(props: DataTableBodyCellProps<T>) {
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
        className={[styles.BodyCell, className, defClassName]
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
