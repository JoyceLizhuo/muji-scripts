import React from 'react'
import { Link } from 'react-router-dom'
import styled, { css, keyframes } from 'styled-components'
import routerPath from '../../../util/routerPath'

const Item = styled.section`
  padding: 30px;
  margin-bottom: 30px;
`

const Button1 = styled.button`
  background: #666;
  border: 2px solid red;
`

const Button2 = styled.button<{ lighter?: boolean }>`
  background: transparent;

  ${({ lighter }) =>
    lighter
      ? css`
          border-color: red;
        `
      : ''}
  &:hover {
    border-color: #f60;
  }
`

Button2.defaultProps = {
  lighter: false,
}

const Button3 = styled.button({
  boxShadow: '0 0 10px tan',
})

const Button4 = styled(Button3)(({ primary }: { primary?: boolean }) => {
  return {
    background: 'var(--mainColor)',
    border: `1px solid ${primary ? 'red' : '#666'}`,
  }
})

const rotate = keyframes`
  from {
    transform: rotate(0deg);
    color: #f60;
  }
  to {
    transform: rotate(360deg);
    color: #6f0;
  }
`

const Button5 = styled.button`
  animation: ${rotate} 2s linear infinite;
`

interface P {
  children?: React.ReactNode
}

const Button6 = ({ children }: P) => {
  return <>{children}</>
}

const Button7 = styled(Link)`
  border: 1px solid red;
  padding: 8px 10px;
  color: red;
`

const Input = styled.input.attrs({
  type: 'passWord',
})`
  border: 1px solid #612543;
`

export class Demo extends React.PureComponent<{}> {
  private readonly btn1: React.RefObject<HTMLButtonElement>
  public constructor(props: {}) {
    super(props)
    this.btn1 = React.createRef()
  }
  public componentDidMount() {
    document.title = 'styled-component'
    console.info('btn1 ref: ', this.btn1)
  }

  public render() {
    return (
      <div>
        <Item>
          <Button1 className="diy-className" ref={this.btn1}>
            Button1
          </Button1>
        </Item>
        <Item>
          <Button2>Button2</Button2>
          <Button2 lighter>Button2 lighter</Button2>
        </Item>
        <Item>
          <Button3>Button3</Button3>
        </Item>
        <Item>
          <Button4>Button4</Button4>
          <Button4 primary>Button4 primary</Button4>
        </Item>
        <Item>
          <Button5>Button5</Button5>
        </Item>
        <Item>
          <Button6>Button6</Button6>
        </Item>
        <Item>
          <Button7 to={routerPath.home}>Button7,link to home</Button7>
        </Item>
        <Item>
          <Input defaultValue="123" />
        </Item>
        <Item>
          ================================================================================================
        </Item>
      </div>
    )
  }
}
