import React from 'react'
import styled from 'styled-components'
import { Children } from '../@types/react'

const R = styled.div`
  font-size: 34px;
  color: #ccc;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

export default function BodyTip({ children }: Children) {
  return <R>{children}</R>
}
