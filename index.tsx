import React from "react";
import { render } from "react-dom";
import styled from "styled-components";
import { createAdapter } from "@most/adapter";
import {
  tap,
  runEffects,
  map,
  periodic,
  scan,
  sample,
  chain,
  startWith,
  now,
  switchLatest,
  merge
} from "@most/core";
import { renderReactNodeStream, FromStream } from "./stream";

const Header = styled.header`
  border-bottom: 1px solid #000;
  height: 10vh;
  width: 100vw;
  overflow: hidden;
`;
const Area = styled.div`
  position: relative;
  height: 90vh;
  width: 100vw;
`;
const ItemToDrag = styled.div`
  width: 5vh;
  height: 5vh;
  border: 2px solid yellow;
  position: absolute;
  ${(props: { left: number; top: number }) => `
  left: ${props.left}px;
  top: ${props.top}px;
  `};
`;
const Container = styled.main`
  margin: 0;
`;
type MouseMove = React.MouseEvent<HTMLDivElement, MouseEvent>;
const [onMouseMove, mouseMoves] = createAdapter<MouseMove>();
type MouseDown = MouseMove;
const [onMouseDown, mouseDown] = createAdapter<MouseDown>();
type MouseUp = MouseMove;
const [onMouseUp, mouseUp] = createAdapter<MouseUp>();

const eventToCoords = (e: MouseMove) => ({
  x: e.clientX,
  y: e.clientY
});

const beginDrag = (e: MouseDown) =>
  startWith(eventToCoords(e), map(eventToCoords, mouseMoves));

const endDrag = (e: MouseUp) => now(eventToCoords(e));

const makeDraggable = () => {
  const drag = map(beginDrag, mouseDown);
  const drop = map(endDrag, mouseUp);
  return startWith({ x: 200, y: 100 }, switchLatest(merge(drag, drop)));
};

const clock = periodic(500);
const count = (result: number, a: unknown) => result + 1;
const mouseMovesNumber = chain(() => scan(count, 0, mouseMoves), clock);
const Tick = styled.div`
  display: inline-block;
  padding: 3px;
`;
const Ticks = renderReactNodeStream(
  map(
    moves => (
      <>
        {moves.map(i => (
          <Tick>{i}</Tick>
        ))}
      </>
    ),
    scan(
      (result, movesNumber) => [movesNumber, ...result],
      [] as number[],
      sample(mouseMovesNumber, clock)
    )
  )
);

const App = () => (
  <Container onMouseUp={onMouseUp}>
    <Header>
      <Ticks />
    </Header>
    <Area onMouseMove={onMouseMove}>
      <FromStream stream={makeDraggable()}>
        {coords => (
          <ItemToDrag
            onMouseDown={onMouseDown}
            left={coords.x}
            top={coords.y}
          />
        )}
      </FromStream>
    </Area>
  </Container>
);
render(<App />, document.getElementById("app"));
