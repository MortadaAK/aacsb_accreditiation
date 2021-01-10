import React, { useEffect, useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { isBN } from "bn.js";
import useStore from "../Store";
export const EMPTY = "0x0000000000000000000000000000000000000000";
interface ValueProps<T> {
  value: ((...args: any[]) => Promise<T>) | undefined;
  params?: any[];
  topic?: string;
  children?: (value: T | undefined) => React.ReactElement | null;
}
/**
 *
 * A component that receive an async function (value) then renders it when it is ready.
 * In case of custom render, the children should be used as render props style.
 */
function Value<T>({ value, params, topic, children }: ValueProps<T>) {
  const [result, setRestult] = useState<T | undefined>(undefined);
  const notification = useStore((state) =>
    topic ? state.notification(topic, params) : 0
  );
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (typeof value === "function") {
      value
        .apply(null, params || [])
        .then((result) => {
          if (typeof result !== "string" || result !== EMPTY) {
            setRestult(result);
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [value, notification, params]);

  if (loading) {
    return (
      <>
        <CircularProgress size={18} />
      </>
    );
  } else if (children && typeof children === "function") {
    return <>{children(result)}</>;
  } else if (isBN(result)) {
    return <>{result.toString()}</>;
  } else if (typeof result === "string" || typeof result === "number") {
    return <>{result}</>;
  } else {
    return <>{JSON.stringify(result)}</>;
  }
}
export default Value;
