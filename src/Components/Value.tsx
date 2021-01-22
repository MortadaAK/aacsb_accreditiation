import React, { useEffect, useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { isBN } from "bn.js";
import { useSubscription } from "../Store";
export const EMPTY = "0x0000000000000000000000000000000000000000";
type ContractBuilder<T> = (address: string) => Promise<T>;
interface ValueProps<T> {
  value: ((...args: any[]) => Promise<T>) | undefined;
  contractBuilder?: ContractBuilder<T>;
  params?: any[];
  children?: (value: T | undefined) => React.ReactElement | null;
  topic?: string;
}

/**
 *
 * A component that receive an async function (value) then renders it when it is ready.
 * In case of custom render, the children should be used as render props style.
 */
function Value<T>({
  value,
  params,
  children,
  contractBuilder,
  topic,
}: ValueProps<T>) {
  const [result, setRestult] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const at = useSubscription((state) => (topic ? state[topic] : undefined));
  useEffect(() => {
    const load = async (counter = 5) => {
      try {
        if (typeof value === "function") {
          const result = await value.apply(null, params || []);
          if (typeof result !== "string" || result !== EMPTY) {
            if (contractBuilder) {
              const contract = await contractBuilder(result as any);
              setRestult(contract);
            } else {
              setRestult(result);
            }
          }
        }
        setLoading(false);
      } catch (e) {
        if (counter > 0) setTimeout(() => load(counter - 1));
      }
    };
    load();
  }, [value, contractBuilder, params, at]);

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
