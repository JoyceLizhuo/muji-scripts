import React from 'react'
type childrenType = React.ReactNode

export interface Children {
  children?: childrenType
}

export interface P {
  children?: childrenType
  className?: string
}
