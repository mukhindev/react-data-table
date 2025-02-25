import { ForwardedRef, HTMLAttributes, forwardRef, ReactElement } from "react";
import { ColumnDef, FilterDef } from "../../types";
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

  /** Сортировка таблицы */
  sort?: string;
  /** Фильтр таблицы */
  filter?: FilterDef;
  /** Отображение шапки таблицы (по-умолчанию true) */
  onSort?: (sort?: string) => void;
  onFilter?: (filter: FilterDef) => void;
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
    sort,
    filter,
    onSort,
    onFilter,
    ...divProps
  } = props;

  const filterCount = Object.values(filter ?? {}).filter((el) => el).length;

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
      className={[styles.root, className].filter((el) => el).join(" ")}
      ref={ref}
    >
      {filter && (
        <>
          Фильтров: {filterCount}
          <button onClick={() => onFilter?.({})}>Очистить фильтры</button>
        </>
      )}
      <Table className={styles.__table} {...table?.props}>
        <TableHead {...thead?.props}>
          <TableRow {...tr?.props}>
            {defs.map((def, defIndex) => {
              return (
                <DataTableHeadCell
                  key={defIndex}
                  def={def}
                  td={td}
                  sort={sort}
                  filter={filter}
                  onSort={onSort}
                  onFilter={onFilter}
                />
              );
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
