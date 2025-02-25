import { HTMLAttributes, ReactElement, useState } from "react";
import { ColumnDef, FilterDef } from "../../types";
import styles from "./DataTableHeadCell.module.css";

interface DataTableHeadCellProps<T>
  extends HTMLAttributes<HTMLTableCellElement> {
  /** Определение колонки (свойства колонки) */
  def: ColumnDef<T>;
  td?: ReactElement;

  sort?: string;
  filter?: FilterDef;
  onSort?: (sort?: string) => void;
  onFilter?: (filter: FilterDef) => void;
}

export default function DataTableHeadCell<T>(props: DataTableHeadCellProps<T>) {
  const { def, className, td, sort, filter, onSort, onFilter } = props;

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

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const hasSort = sort !== undefined && !!def.sort;
  const sortKey = def.sort === true ? def.valueKey : def.sort;
  const hasSortNow = hasSort && sortKey === sort?.replace("-", "");
  const direction = sort?.startsWith("-") ? -1 : 1;

  const hasFilter = filter !== undefined && !!def.filterKey;

  const hasFilterNow = !!(
    hasFilter &&
    def.filterKey &&
    filter?.[def.filterKey]
  );

  const handleSort = (direction: number) => {
    if (!hasSortNow) {
      // @ts-ignore
      onSort?.(sortKey);
      return;
    }

    onSort?.(`${direction === 1 ? "" : "-"}${sortKey}`);
  };

  const openFilter = () => {
    setIsFilterOpen(true);
  };

  let filterElement = null;

  if (filter && def.filterKey && !def.renderFilter) {
    const filterKey = def.filterKey;

    filterElement = (
      <input
        autoFocus
        // @ts-ignore
        value={filter[filterKey] ?? ""}
        onChange={(evt) => {
          onFilter?.({
            ...filter,
            [filterKey]: evt.target.value,
          });
        }}
      />
    );
  }

  if (filter && def.filterKey && def.renderFilter) {
    filterElement = def?.renderFilter?.({
      filter: filter ?? {},
      filterKey: def.filterKey ?? "no-filter-key",
      changeFilter: (filter) => {
        onFilter?.(filter);
      },
    });
  }

  const TableCell = td?.type ?? "td";

  return (
    <TableCell
      data-component={
        dataComponent
          ? `DataTableHeadCell/${dataComponent}`
          : "DataTableHeadCell"
      }
      className={[styles.root, className, defClassName]
        .filter((el) => el)
        .join(" ")}
      {...td?.props}
      {...cellProps}
    >
      {def.title ?? (def.valueKey as string)}
      {hasFilter && (
        <>
          <div>
            {isFilterOpen && filterElement}
            <button
              disabled={!hasFilterNow}
              onClick={() => {
                if (!def.filterKey) {
                  return;
                }

                onFilter?.({
                  ...filter,
                  [def.filterKey]: undefined,
                });
                setIsFilterOpen(false);
              }}
            >
              Ф
            </button>
          </div>
          <button onClick={() => openFilter()}>
            {!hasFilterNow && "Ф1"}
            {hasFilterNow && "Ф2"}
          </button>
        </>
      )}
      {hasSort && !hasSortNow && (
        <button onClick={() => handleSort(-direction)}>C1</button>
      )}
      {hasSortNow && (
        <button color="primary" onClick={() => handleSort(-direction)}>
          {direction === -1 && "Вверх"}
          {direction === 1 && "Вниз"}
        </button>
      )}
    </TableCell>
  );
}
