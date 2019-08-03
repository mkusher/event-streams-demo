import React from "react";
import { Stream } from "@most/types";
import { runEffects, tap } from "@most/core";
import { newDefaultScheduler } from "@most/scheduler";

export const scheduler = newDefaultScheduler();

export const renderReactNodeStream: <P>(
  s: Stream<React.ReactNode>
) => React.ComponentType<P> = stream => () => (
  <FromStream stream={stream}>{node => node}</FromStream>
);

export class FromStream<A> extends React.Component<
  { stream: Stream<A>; children: (value: A) => React.ReactNode },
  { value: A | null }
> {
  state: { value: A | null } = { value: null };
  setValue = (value: A) => {
    this.setState({ value });
  };
  effect = runEffects(tap(this.setValue, this.props.stream), scheduler);
  render() {
    if (!this.state.value) {
      return null;
    }
    return this.props.children(this.state.value);
  }
}
