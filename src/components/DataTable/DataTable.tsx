import { ForwardedRef, HTMLAttributes, ReactNode, forwardRef } from "react";
import styles from "./DataTable.module.css";
import { ColumnDef } from "../../types";

interface DataTableProps<T> extends HTMLAttributes<HTMLDivElement> {
  "data-component"?: string;
  /** Определение колонок таблицы */
  defs: ColumnDef<T>[];
  /** Массив данных для вывода. Каждый элемент — строка */
  data: T[];
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
    ...divProps
  } = props;

  if (!data || !defs) {
    return null;
  }

  return (
    <div
      {...divProps}
      data-component={
        dataComponent ? `DataTable/${dataComponent}` : "DataTable"
      }
      className={[styles.DataTable, className].filter((el) => el).join(" ")}
      ref={ref}
    >
      <table className={styles.Table}>
        <thead>
          <tr>
            {defs.map((def, defIndex) => {
              return <DataTableHeadCell key={defIndex} def={def} />;
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((item, dataIndex) => {
            return (
              <tr key={dataIndex}>
                {defs.map((def, defIndex) => {
                  return (
                    <DataTableBodyCell
                      key={defIndex}
                      def={def}
                      index={dataIndex}
                      item={item}
                    />
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});

interface DataTableHeadCellProps<T>
  extends HTMLAttributes<HTMLTableCellElement> {
  /** Определение колонки (свойства колонки) */
  def: ColumnDef<T>;
}
function DataTableHeadCell<T>(props: DataTableHeadCellProps<T>) {
  const { def, className } = props;
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

  return (
    <td
      data-component={
        dataComponent
          ? `DataTableHeadCell/${dataComponent}`
          : "DataTableHeadCell"
      }
      className={[styles.HeadCell, className, defClassName]
        .filter((el) => el)
        .join(" ")}
      {...cellProps}
    >
      {def.title ?? (def.valueKey as string)}
    </td>
  );
}

interface DataTableBodyCellProps<T>
  extends HTMLAttributes<HTMLTableCellElement> {
  /** Определение колонки (свойства колонки) */
  def: ColumnDef<T>;
  /** Данные строки таблицы */
  item: T;
  index: number;
}

function DataTableBodyCell<T>(props: DataTableBodyCellProps<T>) {
  const { def, item, index, className } = props;

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

    return (
      <td
        data-component={
          dataComponent
            ? `DataTableBodyCell/${dataComponent}`
            : "DataTableBodyCell"
        }
        className={[styles.BodyCell, className, defClassName]
          .filter((el) => el)
          .join(" ")}
        {...cellProps}
      >
        {element}
      </td>
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
