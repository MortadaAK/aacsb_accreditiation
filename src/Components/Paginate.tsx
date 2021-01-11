import React, { useEffect, useState } from "react";
import Value, { EMPTY } from "./Value";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import BN from "bn.js";
import { Link as RouterLink } from "react-router-dom";
const PER_PAGE = 10;
type ContractBuilder<T> = (address: string) => Promise<T>;
type Children<T> = (contract: T) => React.ReactElement;
function Paginate<T>({
  caller,
  contractBuilder,
  children,
  length: lengthFunc,
  prefix,
}: {
  caller: (from: number) => Promise<string[]>;
  contractBuilder: ContractBuilder<T>;
  children: Children<T>;
  length: () => Promise<BN>;
  prefix?: string;
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
    <Value params={[Math.max(0, from)]} value={caller}>
      {(value) => {
        return (
          <List>
            {from > 0 && (
              <ListItem button onClick={() => setFrom(from - PER_PAGE)}>
                Previous
              </ListItem>
            )}
            {value
              ?.filter((value) => value && value !== EMPTY)
              .map((value) => (
                <Item<T>
                  value={value}
                  key={value}
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
function Item<T>({
  value,
  contractBuilder,
  children,
  prefix,
}: {
  value: string;
  prefix?: string;
  children: Children<T>;
  contractBuilder: ContractBuilder<T>;
}) {
  const component = (
    <Value params={[value]} value={contractBuilder}>
      {(result) => (result ? children(result) : null)}
    </Value>
  );
  if (typeof prefix === "string") {
    return (
      <ListItem
        button
        key={value}
        component={RouterLink}
        to={prefix + "/" + value}
      >
        {component}
      </ListItem>
    );
  } else {
    return <ListItem key={value}>{component}</ListItem>;
  }
}
export default Paginate;
