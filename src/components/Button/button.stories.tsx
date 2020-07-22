import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import Button from "./button";

const defaultButton = () => (
  <>
    <Button onClick={action("clicked")}>default button</Button>
    <Button disabled>Disabled button</Button>
  </>
);

const buttonWithSize = () => (
  <>
    <Button size="lg">large button</Button>
    <Button size="sm">small button</Button>
  </>
);

const buttonWithType = () => (
  <>
    <Button btnType="default">default button</Button>
    <Button btnType="primary">primary button</Button>
    <Button btnType="danger">danger button</Button>
    <Button btnType="link" href="https://www.baidu.com">
      link button
    </Button>
    <Button btnType="link" disabled href="https://www.baidu.com">
      disabled link
    </Button>
  </>
);

// 设置组件居中显示
const styles: React.CSSProperties = {
  textAlign: "center"
}
/**
 * 1. 装饰器addon
 * 接收function，返回其他节点
 * 要想使全局组件都居中，可以把下列代码设置在config.ts中 
*/ 
const CenterDecorator = (storyFn: any) => <div style={styles}>{storyFn()}</div>


// 给storybook添加展示的组件
storiesOf("Button Component", module)
  .add("Button", defaultButton)
  // 单个组件生效 优先级高 覆盖之前的info
  .add("不同尺寸的Button", buttonWithSize)
  .add("不同类型的button", buttonWithType);

storiesOf("Button Component", module)
  .addDecorator(CenterDecorator)
  .add("居中显示的Button", defaultButton);
