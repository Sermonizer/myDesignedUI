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

// 测试普通的属性
const testProps: MenuProps = {
  defaultIndex: "0",
  onSelect: jest.fn(),
  className: "test",
};

// 垂直时的属性
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

// 由于是用css控制submenu出现和消失的，因此添加一段css代码用来测试
const createStyleFile = () => {
  const cssFile: string = `
  .submenu {
    display: none
  }
  .submenu.menu-opened {
    display: block
  }
  `;
  // 创建style文件
  const style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = cssFile;
  return style;
};

let wrapper: RenderResult, // 包装函数
  menuElement: HTMLElement, // 外侧Menu节点
  activeElement: HTMLElement, // 第二个active节点
  disabledElement: HTMLElement; // 第三个disabled节点
// 单元测试
describe("测试Menu和MenuItem组件", () => {
  // 钩子函数 在每个测试运行前都会跑 保存一些可能会重复的
  beforeEach(() => {
    wrapper = render(generateMenu(testProps));
    // 插入有CSS样式的HTMLStyleElement节点
    wrapper.container.append(createStyleFile());
    menuElement = wrapper.getByTestId("test-menu");
    activeElement = wrapper.getByText("active");
    disabledElement = wrapper.getByText("disabled");
  });

  it("should render correct Menu and MenuItem based on default props", () => {
    expect(menuElement).toBeInTheDocument();
    expect(menuElement).toHaveClass("menu test");
    /**
     * 希望测试共有多少个一级li节点，但是getElementsByTagName('li')
     * 获取了所有的li节点，因此与期望的li节点数目不同，会报错
     * 要判断有几个一级结点，使用css的:scope伪类选择器，选择了menuElement本身的li节点
     */
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
    // 测试点击disabledElement时，onselect没有被调用
    fireEvent.click(disabledElement);
    expect(disabledElement).not.toHaveClass("is-active");
    expect(testProps.onSelect).not.toHaveBeenCalledWith("1");
  });

  it("should render vertical mode", () => {
    // beforeEach中渲染了wrapper 但是单元开始时又被渲染了一次 导致出错
    // React-testing-library在每个单元结束后都会调用cleanup()方法，将所有渲染回收,因此不同单元之间不会出现问题
    cleanup();
    const wrapper = render(generateMenu(testVerticalProps));
    const menuElement = wrapper.getByTestId("test-menu");
    expect(menuElement).toHaveClass("menu-vertical");
  });
  // 添加subMenu的逻辑
  // 将回调函数设置为async()类型
  it("should show dropdown items when hover on subMenu", async () => {
    // 在横向模式时，drop1是隐藏的，不可见
    const dropdownElement = wrapper.getByText("dropdown");
    // 鼠标移入
    fireEvent.mouseEnter(dropdownElement);
    // 由于设置了setTimeout，直接使用断言会导致测试失败
    // 在wait()方法中传入回调函数，添加断言，解决异步问题
    await wait(() => {
      expect(wrapper.queryByText("drop1")).toBeVisible();
    });
    // 点击第一项，触发onSelect方法
    fireEvent.click(wrapper.getByText("drop1"));
    expect(testProps.onSelect).toHaveBeenCalledWith("3-0");
    // 鼠标移出
    fireEvent.mouseLeave(dropdownElement);
    await wait(() => {
      // 由于是异步执行，会等待断言执行完毕
      expect(wrapper.queryByText("drop1")).not.toBeVisible();
    });
  });
});
