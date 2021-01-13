import React, { useEffect, useState } from "react";
import Value, { EMPTY } from "./Value";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import BN from "bn.js";
import { Link as RouterLink } from "react-router-dom";
const PER_PAGE = 10;
type ContractBuilder<T, K> = (address: K) => Promise<T>;
type Children<T> = (contract: T) => React.ReactElement;
type Prefix<T> = string | ((value: T) => string);
function Paginate<T, K>({
  caller,
  contractBuilder,
  children,
  length: lengthFunc,
  prefix,
  additionalParams = [],
}: {
  caller: (from: number, ...args: any[]) => Promise<K[]>;
  contractBuilder: ContractBuilder<T, K>;
  children: Children<T>;
  length: () => Promise<BN>;
  prefix?: Prefix<K>;
  additionalParams?: any[];
}) {
  const [from, setFrom] = useState(0);
  const [length, setLength] = useState(0);
  useEffect(() => {
    lengthFunc()
      .then((length) => setLength(length.toNumber()))
      .catch(() => {
        setLength(0);
      });
  });
  return (
    <Value params={[Math.max(0, from), ...additionalParams]} value={caller}>
      {(value) => {
        return (
          <List>
            {from > 0 && (
              <ListItem button onClick={() => setFrom(from - PER_PAGE)}>
                Previous
              </ListItem>
            )}
            {value
              ?.filter((value) => {
                if (!value) {
                  return false;
                } else if (typeof value === "string") {
                  return value !== EMPTY;
                } else if (typeof value === "object") {
                  // @ts-ignore
                  return value.id !== "0" && value.id !== 0;
                } else if (typeof value === "boolean") {
                  return true;
                } else {
                  return value;
                }
              })
              .map((value) => (
                <Item<T, K>
                  value={value}
                  key={JSON.stringify(value)}
                  prefix={prefix}
                  children={children}
                  contractBuilder={contractBuilder}
                />
              ))}
            {length > from + PER_PAGE && (
              <ListItem button onClick={() => setFrom(from + PER_PAGE)}>
                More
              </ListItem>
            )}
          </List>
        );
      }}
    </Value>
  );
}
function Item<T, K>({
  value,
  contractBuilder,
  children,
  prefix,
}: {
  value: K;
  prefix?: Prefix<K>;
  children: Children<T>;
  contractBuilder: ContractBuilder<T, K>;
}) {
  const component = (
    <Value params={[value]} value={contractBuilder}>
      {(result) => (result ? children(result) : null)}
    </Value>
  );
  const key = JSON.stringify(value);
  let to = "";
  if (typeof prefix === "string") {
    to = prefix + "/" + value;
  } else if (typeof prefix === "function") {
    to = prefix(value);
  }
  if (to !== "") {
    return (
      <ListItem button key={key} component={RouterLink} to={to}>
        {component}
      </ListItem>
    );
  } else {
    return <ListItem key={key}>{component}</ListItem>;
  }
}
export default Paginate;
