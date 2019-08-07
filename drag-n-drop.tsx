import React from "react";
import styled from "styled-components";
import {
  sample,
  startWith,
  map,
  now,
  switchLatest,
  merge,
  periodic,
  chain,
  scan
} from "@most/core";
import { renderReactNodeStream, FromStream } from "./stream";
import { createAdapter } from "@most/adapter";
import randomColor from "randomcolor";

const Area = styled.div`
  position: relative;
  height: 90vh;
  width: 100vw;
  overflow: hidden;
`;
const ItemToDrag = styled.div`
  width: 5vh;
  height: 5vh;
  border: 2px solid ${randomColor({ luminosity: "dark" })};
  position: absolute;
  ${(props: { left: number; top: number }) => `
  left: ${props.left}px;
  top: ${props.top}px;
  `};
`;
const Tick = styled.div`
  display: inline-block;
  padding: 3px;
`;

const clock = periodic(500);

type MouseMove = React.MouseEvent<HTMLDivElement, MouseEvent>;
const [onMouseMove, mouseMoves] = createAdapter<MouseMove>();
type MouseDown = MouseMove;
const [onMouseDown, mouseDown] = createAdapter<MouseDown>();
type MouseUp = MouseMove;
const [onMouseUp, mouseUp] = createAdapter<MouseUp>();

const moveToCoords = (dc: { x: number; y: number } = { x: 0, y: 0 }) => (
  e: MouseMove
) => ({
  x: e.clientX - dc.x,
  y: e.clientY - dc.y
});

const delta = (e: MouseDown) => ({
  x: e.clientX - e.target.offsetLeft,
  y: e.clientY - e.target.offsetTop
});

const beginDrag = (e: MouseDown) => map(moveToCoords(delta(e)), mouseMoves);

const endDrag = (e: MouseUp) => now(moveToCoords(delta(e))(e));

export const makeDraggable = (initialPosition: { x: number; y: number }) => {
  const drag = map(beginDrag, mouseDown);
  const drop = map(endDrag, mouseUp);
  return startWith(initialPosition, switchLatest(merge(drag, drop)));
};

const count = (result: number, a: unknown) => result + 1;
export const mouseMovesNumber = chain(() => scan(count, 0, mouseMoves), clock);
export const Ticks = renderReactNodeStream(
  map(
    moves => (
      <>
        <span>Number of mouse moves per tick:</span>
        {moves.map((i, index) => (
          <Tick key={index}>{i}</Tick>
        ))}
      </>
    ),
    scan(
      (result: number[], movesNumber: number) => [movesNumber, ...result],
      [] as number[],
      sample(mouseMovesNumber, clock)
    )
  )
);

export const StreamDragDrop = () => (
  <Area onMouseMove={onMouseMove} onMouseUp={onMouseUp}>
    <FromStream stream={makeDraggable({ x: 200, y: 100 })}>
      {coords => (
        <ItemToDrag onMouseDown={onMouseDown} left={coords.x} top={coords.y} />
      )}
    </FromStream>
  </Area>
);
