import { HTMLAttributes, ReactNode } from "react";

/** Определение колонок таблицы */
export interface BaseColumnDef<ExtraCellProps = object> {
  title?: ReactNode;
  cellProps?: HTMLAttributes<HTMLTableCellElement> & ExtraCellProps;
  headCellProps?: HTMLAttributes<HTMLTableCellElement> & ExtraCellProps;
  bodyCellProps?: HTMLAttributes<HTMLTableCellElement> & ExtraCellProps;
}

interface ColumnDefRenderValue<T, C = object> extends BaseColumnDef<C> {
  valueKey: ObjectDotNotation<T>;
  render?: undefined;
}

interface ColumnDefRenderCustom<T, C = object> extends BaseColumnDef<C> {
  valueKey?: undefined;
  render: (item: T, index: number) => ReactNode;
}

export type ColumnDef<T, C = object> =
  | ColumnDefRenderValue<T, C>
  | ColumnDefRenderCustom<T, C>;

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
