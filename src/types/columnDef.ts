import { HTMLAttributes, ReactNode } from "react";

/** Определение колонок таблицы */
export interface BaseColumnDef {
  title?: ReactNode;
  cellProps?: HTMLAttributes<HTMLTableCellElement>;
  headCellProps?: HTMLAttributes<HTMLTableCellElement>;
  bodyCellProps?: HTMLAttributes<HTMLTableCellElement>;
}

interface ColumnDefRenderValue<T> extends BaseColumnDef {
  valueKey: ObjectDotNotation<T>;
  render?: undefined;
}

interface ColumnDefRenderCustom<T> extends BaseColumnDef {
  valueKey?: undefined;
  render: (item: T, index: number) => ReactNode;
}

export type ColumnDef<T> = ColumnDefRenderValue<T> | ColumnDefRenderCustom<T>;

type BreakDownObject<O, R = void> = {
  [K in keyof O as string]: K extends string
    ? R extends string
      ? ObjectDotNotation<O[K], `${R}.${K}`>
      : ObjectDotNotation<O[K], K>
    : never;
};

export type ObjectDotNotation<O, R = void> = O extends string | number
  ? R extends string | number
    ? R
    : never
  : BreakDownObject<O, R>[keyof BreakDownObject<O, R>];
