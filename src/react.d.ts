import { ReactNode, Ref, RefAttributes } from "react";

export declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: unknown;
  }

  interface HTMLAttributes {
    "data-component"?: string;
  }

  function forwardRef<T, P>(
    render: (props: P, ref: Ref<T>) => ReactNode | null
  ): (props: P & RefAttributes<T>) => ReactNode | null;
}
