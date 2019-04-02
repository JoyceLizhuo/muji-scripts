import React from 'react'
import BodyTip from '../components/BodyTip'

interface State {
  clickedTimes: number
}

export default class BatchUpdate extends React.Component<{}, State> {
  public constructor(props: {}) {
    super(props)
    this.state = {
      clickedTimes: 0,
    }
  }

  public up = () => {
    let {
      state: { clickedTimes },
    } = this
    this.setState({
      clickedTimes: ++clickedTimes,
    })
  }

  public down = () => {
    let {
      state: { clickedTimes },
    } = this
    this.setState({
      clickedTimes: --clickedTimes,
    })
  }

  public render() {
    const {
      state: { clickedTimes },
      up,
      down,
    } = this
    return (
      <BodyTip>
        <div>clicked {clickedTimes} times</div>
        <div>
          <button onClick={up}>+</button>
          <button onClick={down}>-</button>
        </div>
      </BodyTip>
    )
  }
}
