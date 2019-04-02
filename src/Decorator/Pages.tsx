import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { P } from '../@types/react'
import { home, pages } from '../util/routerPath'

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  position: sticky;
  top: 0;
  z-index: 99;
  background: #fff;
`

const Button = styled(Link)`
  padding: 4px 8px;
`

export default function PagesDecorator({ children, className }: P) {
  return (
    <div className={className}>
      <Wrap>
        <Button to={home.home}>Home</Button>
        {Object.entries(pages).map(([key, path]) => (
          <Button key={key} to={path}>
            {key}
          </Button>
        ))}
      </Wrap>
      {children}
    </div>
  )
}
