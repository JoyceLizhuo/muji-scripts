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

export default class Rxjs extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props)
    this.state = {}
  }

  static getDerivedStateFromProps() {
    console.info('getDerivedStateFromProps')
    return {}
  }

  public render() {
    return <div>123</div>
  }
}
