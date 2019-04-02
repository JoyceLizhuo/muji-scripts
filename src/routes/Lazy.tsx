import React from 'react'
import BodyTip from '../components/BodyTip'

export default function Lazy() {
  return (
    <BodyTip>
      <div className="lazy-root">
        <p className="txt">I am a lazy component</p>
      </div>
    </BodyTip>
  )
}
