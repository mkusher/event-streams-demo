import React from "react";
import styled from "styled-components";
import { createAdapter } from "@most/adapter";
import {
  scan,
  merge,
  map,
  startWith,
  periodic,
  sample,
  switchLatest
} from "@most/core";
import { FromStream } from "./stream";

const [onPlusClick, plusClicks] = createAdapter<any>();
const [onMinusClick, minusClicks] = createAdapter<any>();

const clock = periodic(1000);

const counter = startWith(
  0,
  scan(
    (a: number, b: number) => a + b,
    0,
    merge(map(() => 1, plusClicks), map(() => -1, minusClicks))
  )
);
const delayedCounter = sample(counter, clock);
const counterWithReset = switchLatest(map(() => counter, clock));

export const ClockCounter = () => (
  <Area>
    <Result>
      Delayed:{" "}
      <FromStream stream={delayedCounter}>{result => result}</FromStream>
    </Result>
    <Result>
      Reset:{" "}
      <FromStream stream={counterWithReset}>{result => result}</FromStream>
    </Result>
    <Button onClick={onPlusClick}>+</Button>
    <Button onClick={onMinusClick}>-</Button>
  </Area>
);

const Area = styled.section`
  text-align: center;
`;
const Result = styled.h2``;
const Button = styled.button`
  width: 10vw;
  height: 10vh;
`;
