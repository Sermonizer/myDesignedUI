import React from "react";
import {
  render,
  RenderResult,
  fireEvent,
  cleanup,
  wait,
} from "@testing-library/react";
import Menu, { MenuProps } from "./menu";
import MenuItem from "./menuItem";
import SubMenu from "./subMenu";

const testProps: MenuProps = {
  defaultIndex: "0",
  onSelect: jest.fn(),
  className: "test",
};

const testVerticalProps: MenuProps = {
  defaultIndex: "0",
  mode: "vertical",
};

// 用于生成渲染不同组件的函数
const generateMenu = (props: MenuProps) => {
  return (
    <Menu {...props}>
      <MenuItem>active</MenuItem>
      <MenuItem disabled>disabled</MenuItem>
      <MenuItem>xyz</MenuItem>
      <SubMenu title="dropdown">
        <MenuItem>drop1</MenuItem>
      </SubMenu>
    </Menu>
  );
};

const createStyleFile = () => {
  const cssFile: string = `
  .submenu {
    display: none
  }
  .submenu.menu-opened {
    display: block
  }
  `;
  const style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = cssFile;
  return style;
};

let wrapper: RenderResult,
  menuElement: HTMLElement,
  activeElement: HTMLElement,
  disabledElement: HTMLElement;
// 单元测试
describe("测试Menu和MenuItem组件", () => {
  // 钩子函数 在每个测试运行前都会跑 保存一些可能会重复的
  beforeEach(() => {
    wrapper = render(generateMenu(testProps));
    wrapper.container.append(createStyleFile());
    menuElement = wrapper.getByTestId("test-menu");
    activeElement = wrapper.getByText("active");
    disabledElement = wrapper.getByText("disabled");
  });

  it("should render correct Menu and MenuItem based on default props", () => {
    expect(menuElement).toBeInTheDocument();
    expect(menuElement).toHaveClass("menu test");
    // 判断有几个一级结点 css :scope伪类 选择了muneElement本身 
    expect(menuElement.querySelectorAll(":scope > li").length).toEqual(4);
    // expect(menuElement.getElementsByTagName('li').length).toEqual(3)
    expect(activeElement).toHaveClass("menu-item is-active");
    expect(disabledElement).toHaveClass("menu-item is-disabled");
  });

  it("click items should change active and call right callback", () => {
    const thirdItem = wrapper.getByText("xyz");
    // 点击第三个menu
    fireEvent.click(thirdItem);
    // 第三个应该是active 且第一个不是active 且onselect也被调用
    expect(thirdItem).toHaveClass("is-active");
    expect(activeElement).not.toHaveClass("is-active");
    expect(testProps.onSelect).toHaveBeenCalledWith("2");
    // 测试点击disabled 且onselect没有被调用
    fireEvent.click(disabledElement);
    expect(disabledElement).not.toHaveClass("is-active");
    expect(testProps.onSelect).not.toHaveBeenCalledWith("1");
  });
  
  it("should render vertical mode", () => {
    // beforeEach中渲染了wrapper 但是单元开始时又被渲染了一次 导致出错
    // React test lib在单元结束后都会调用cleanup方法，将所有渲染回收
    cleanup();
    const wrapper = render(generateMenu(testVerticalProps));
    const menuElement = wrapper.getByTestId("test-menu");
    expect(menuElement).toHaveClass("menu-vertical");
  });

  it("should show dropdown items when hover on subMenu", async () => {
    const dropdownElement = wrapper.getByText("dropdown");
    fireEvent.mouseEnter(dropdownElement);
    await wait(() => {
      // 由于是异步执行 因此可以用这种方法，会等待断言执行完毕
      expect(wrapper.queryByText("drop1")).toBeVisible();
    });
    fireEvent.click(wrapper.getByText("drop1"));
    expect(testProps.onSelect).toHaveBeenCalledWith("3-0");

    fireEvent.mouseLeave(dropdownElement)
    await wait(() => {
      // 由于是异步执行 因此可以用这种方法，会等待断言执行完毕
      expect(wrapper.queryByText("drop1")).not.toBeVisible();
    });
  });
});

// expect(wrapper.queryByText("drop1")).not.toBeVisible();