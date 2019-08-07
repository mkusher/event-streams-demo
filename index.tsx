import React from "react";
import { render } from "react-dom";
import styled from "styled-components";
import { Ticks, StreamDragDrop } from "./drag-n-drop";
import randomColor from "randomcolor";
import { Counter } from "./counter";
import { ClockCounter } from "./clock-counter";

const Header = styled.header`
  border-bottom: 1px solid #000;
  height: 10vh;
  width: 100vw;
  overflow: hidden;
`;
const Container = styled.main`
  display: flex;
  flex-direction: column;
  margin: 0;
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
`;
const Screen = styled.section`
  width: 100vw;
  height: 100vh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  overflow: hidden;
  ${() => `background-color: ${randomColor({ luminosity: "light" })};`};
`;
const Title = styled.h1`
  text-align: center;
  font-size: 8vh;
`;
const Code = styled.pre`
  background-color: grey;
  width: 50vw;
  min-height: 70vh;
  margin: 0 auto;
  font-size: 5vh;
  color: white;
  overflow: scroll;
`;

const firstClassCitCode = `
  const a = f()
  const b = g(a)
  const c = h(g)(b)(f)(a)
`;
const proceduralEventsCode = `
function onEvent(e) {
  // process it here
}
`;
const reduxQuestionCode = `
(state, action) => {
  // return new state here
}
`;
const promisesCode = `
const all = Promise.all([
  p1,
  p2,
  p3
])
const first = Promise.race([
  p1,
  p2,
  p3
])
`;
const reduxImpl = `
scan(
  reducer,
  initialState,
  actionsStream
)
`;

const App = () => (
  <Container>
    <Screen>
      <Title>About event streams</Title>
    </Screen>
    <Screen>
      <Title>Procedural event handling</Title>
      <Code>{proceduralEventsCode}</Code>
    </Screen>
    <Screen>
      <Title>First class citizen</Title>
      <Code>{firstClassCitCode}</Code>
    </Screen>
    <Screen>
      <Title>Promises</Title>
      <Code>{promisesCode}</Code>
    </Screen>
    <Screen>
      <Title>Event emitter</Title>
      <Code>{firstClassCitCode}</Code>
    </Screen>
    <Screen>
      <Title>Redux?</Title>
      <Code>{reduxQuestionCode}</Code>
    </Screen>
    <Screen>
      <Title>Simple counter</Title>
      <Counter />
    </Screen>
    <Screen>
      <Title>Counter with clock</Title>
      <ClockCounter />
    </Screen>
    <Screen>
      <Title>Drag'n'drop example</Title>
      <Header>
        <Ticks />
      </Header>
      <StreamDragDrop />
    </Screen>
    <Screen>
      <Title>Redux?</Title>
      <Code>{reduxImpl}</Code>
    </Screen>
  </Container>
);
render(<App />, document.getElementById("app"));
