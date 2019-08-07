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

// -a-a-  A
// a => b F
// -b-b-  map(F, A)
const pluses = map(() => 1, plusClicks);
const minuses = map(() => -1, minusClicks);

// -a-a-----a----a---- A
// b----b-b----b------ B
// ba-a-b-b-a--b-a---- merge(A,B)
const plusesAndMinuses = merge(pluses, minuses);
const sum = (a: number, b: number) => a + b;
const counter = startWith(0, scan(sum, 0, plusesAndMinuses));

export const Counter = () => (
  <Area>
    <Result>
      <FromStream stream={counter}>{result => result}</FromStream>
    </Result>
    <Button onClick={onPlusClick}>+</Button>
    <Button onClick={onMinusClick}>-</Button>
  </Area>
);
