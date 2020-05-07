import React from 'react'
import {
  EMPTY,
  from,
  fromEvent,
  interval,
  merge,
  Observable,
  of,
  Subject,
  timer,
} from 'rxjs'
import {
  buffer,
  bufferCount,
  bufferTime,
  bufferWhen,
  combineAll,
  concatAll,
  delay,
  filter,
  map,
  scan,
  take,
  tap,
} from 'rxjs/operators'
import styled, { StyleSheetManager } from 'styled-components'
import BodyTip from '../components/BodyTip'
import { greet } from '../wasm/wasmm/wasmm'

window.foo = (args) => {
  console.info('>>>>>> foo: ', args) // wyh-todo
}

export default class Rxjs extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    greet({
      foo: 123,
      bar: 'asdf',
      baz: [function inBaz() {}],
    })
  }

  public render() {
    return <div>123</div>
  }
}
