import { Menu } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import routerPath from '../util/routerPath'

export default function Home() {
  return (
    <div>
      <Menu>
        {Object.entries(routerPath).map(([key, path]) => (
          <Menu.Item key={key}>
            <Link to={path}>{key}</Link>
          </Menu.Item>
        ))}
      </Menu>
    </div>
  )
}
