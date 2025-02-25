import { ReactNode } from "react";

export type FilterDef = Record<string, unknown>;

export type RenderFilter = (params: {
  filter: FilterDef;
  filterKey: string;
  changeFilter: (filter: FilterDef) => void;
}) => ReactNode;
