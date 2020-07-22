import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import Menu from "./menu";

const defaultMenu = () => (
  <Menu defaultIndex="0">
    <Menu.Item>前端</Menu.Item>
    <Menu.Item>后端</Menu.Item>
  </Menu>
);

const horizontalMenu = () => (
  <Menu
    defaultIndex="0"
    onSelect={action('水平模式')}
    // mode="vertical"
    defaultOpenSubMenus={["2"]}
  >
    <Menu.Item>可乐</Menu.Item>
    <Menu.Item disabled>雪碧</Menu.Item>
    <Menu.SubMenu title="国产品牌">
      <Menu.Item>健力宝</Menu.Item>
      <Menu.Item>哇哈哈</Menu.Item>
      <Menu.Item>雪宝</Menu.Item>
    </Menu.SubMenu>
  </Menu>
);

const verticalMenu = () => (
  <Menu
    defaultIndex="0"
    onSelect={action('垂直模式')}
    style={{ width: 256 }}
    // onSelect={(index) => {
    //   alert(index);
    // }}
    mode="vertical"
    defaultOpenSubMenus={["2"]}
  >
    <Menu.Item>可乐</Menu.Item>
    <Menu.Item disabled>雪碧</Menu.Item>
    <Menu.SubMenu title="国产品牌">
      <Menu.Item>健力宝</Menu.Item>
      <Menu.Item>哇哈哈</Menu.Item>
      <Menu.Item>雪宝</Menu.Item>
    </Menu.SubMenu>
  </Menu>
);

storiesOf("Menu component", module)
  .add("Menu", defaultMenu)
  .add("Horizontal Menu", horizontalMenu)
  .add("Vertical Menu", verticalMenu);
