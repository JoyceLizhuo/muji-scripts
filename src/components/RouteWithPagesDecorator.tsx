import React from 'react'
import { RouteProps } from 'react-router'
import { Route } from 'react-router-dom'
import PagesDecorator from '../Decorator/Pages'

export default function RouteWithPagesDecorator(props: RouteProps) {
  return (
    <PagesDecorator>
      <Route {...props} />
    </PagesDecorator>
  )
}
