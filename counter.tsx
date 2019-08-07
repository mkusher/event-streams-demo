import React from "react";
import styled from "styled-components";
import { createAdapter } from "@most/adapter";
import { scan, merge, map, startWith } from "@most/core";
import { FromStream } from "./stream";

const [onPlusClick, plusClicks] = createAdapter<any>();
const [onMinusClick, minusClicks] = createAdapter<any>();

const Area = styled.section`
  text-align: center;
`;
const Result = styled.h2``;
const Button = styled.button`
  width: 10vw;
  height: 10vh;
`;
const counter = startWith(
  0,
  scan(
    (a: number, b: number) => a + b,
    0,
    merge(map(() => 1, plusClicks), map(() => -1, minusClicks))
  )
);

export const Counter = () => (
  <Area>
    <Result>
      <FromStream stream={counter}>{result => result}</FromStream>
    </Result>
    <Button onClick={onPlusClick}>+</Button>
    <Button onClick={onMinusClick}>-</Button>
  </Area>
);
