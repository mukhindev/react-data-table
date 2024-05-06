# @mukhindev/react-data-table

Data-driven React table

> [!NOTE]  
> Dependencies: Need support for CSS modules in your configuration

Demo: https://github.com/mukhindev/react-data-table-demo

## Install

```
npm install @mukhindev/react-data-table
```

## Without virtualization

This table without virtualization.
So using this table with big data is a bad idea.
Check out [AG-Grid](https://www.ag-grid.com/), [TanStack Table](https://tanstack.com/table/latest) and the same projects.

## Data-driven

An array of identical objects can be easily represented in the form of a table.  
An array element is a table row.  
All you need is to define the columns

## Example

![table example](https://raw.githubusercontent.com/mukhindev/react-data-table/main/docs/attachments/example.png)

```CSS
/* MyComponent.module.css */

.DataTable {
  --color-primary: seagreen;
  --spacing-horizontal: 16px;
}

.RandomHeadCell {
  color: seagreen;
}

.RandomBodyCell {
  color: tomato;
}
```

```JavaScript
import DataTable from "@mukhindev/react-data-table";
import styles from "./MyComponent.module.css";

const data = [
  { id: 1, product: { id: 7, name: "Potato" }, price: 10000 },
  { id: 2, product: { id: 5, name: "Banana" }, price: 32000 },
  { id: 3, product: { id: 9, name: "Orange" }, price: 42500 },
];

function MyComponent() {
  const defs = [
    {
      title: "ID",
      valueKey: "id",
    },
    {
      title: "Product",
      valueKey: "product.name", // dot access support
    },
    {
      title: "Price",
      render: (item) => `${item.price.toLocaleString("ru")} ₽`,
      cellProps: { style: { textAlign: "right" } },
    },
    {
      title: "Random",
      render: () => Math.random().toFixed(3),
      headCellProps: { className: styles.RandomHeadCell },
      bodyCellProps: { className: styles.RandomBodyCell },
    },
  ];

  return <DataTable className={styles.DataTable} data={data} defs={defs} />;
}
```

## TypeScript

```TypeScript
import DataTable, { ColumnDef } from "@mukhindev/react-data-table";

type ProductModel = {
  id: number;
  name: string;
};

// Your data item type
type OrderItemModel = {
  id: number;
  product: ProductModel;
  price: number;
};

const data: OrderItemModel[] = [
  { id: 1, product: { id: 7, name: "Potato" }, price: 10000 },
  { id: 2, product: { id: 5, name: "Banana" }, price: 32000 },
  { id: 3, product: { id: 9, name: "Orange" }, price: 42500 },
];

function MyComponent() {
  const defs: ColumnDef<OrderItemModel>[] = [
    {
      title: "ID",
      valueKey: "id",
    },
    {
      title: "Price",
      render: (item) => `${item.price.toLocaleString("ru")} ₽`,
    }, //       ↑
       // OrderItemModel
  ];

  return <DataTable data={data} defs={defs} />;
}
```