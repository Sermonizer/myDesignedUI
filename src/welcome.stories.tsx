import React from 'react'
import { storiesOf } from '@storybook/react'

storiesOf('Welcome page', module)
  .add('welcome', () => {
    return (
      <>
        <h1>欢迎来到 tx-design 组件库</h1>
        <br></br>
        <p>tx-design: 一套仿照Ant-Design打造的组件库</p>
        <p>安装试试</p>
        <code>
          npm install tx-design --save
        </code>
      </>
    )
  }, { info : { disable: true }})