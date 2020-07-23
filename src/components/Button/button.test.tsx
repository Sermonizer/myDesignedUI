import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Button, { ButtonProps } from "./button";

const defaultProps = {
  onClick: jest.fn()
}

const testProps: ButtonProps = {
  btnType: 'primary',
  size: 'lg',
  className: 'myname'
}

const disabledProps: ButtonProps = {
  disabled: true,
  onClick: jest.fn(),
}

// 利用discript对测试进行分类
describe("test Button component", () => {
  it("shoule render the default button", () => {
    // 模拟渲染一个真实节点
    const wrapper = render(<Button {...defaultProps}>Good</Button>);
    // child表示wrapper上是否有内容“good”
    // const child = wrapper.queryByText("Good"); // 返回联合属性：HtmlElement | undefiend
    const element = wrapper.getByText("Good");
    expect(element).toBeInTheDocument();
    // child就是一个DOM元素，可以使用tagName属性判断是否是Button
    expect(element.tagName).toEqual("BUTTON");
    // 测试Button是否有相应的类
    expect(element).toHaveClass("btn btn-default");
  });
  it("shoule render the other type button", () => {
    const wrapper = render(<Button {...testProps}>Nice</Button>);
    const element = wrapper.getByText("Nice");
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass("btn-primary btn-lg myname");
  });
  it("shoule render a link", () => {
    const wrapper = render(
      <Button btnType="link" href="http://dummyurl">
        Link
      </Button>
    );
    const element = wrapper.getByText("Link");
    expect(element).toBeInTheDocument();
    expect(element.tagName).toEqual("A");
    expect(element).toHaveClass("btn btn-link");
  });
  it("shoule render disabled button", () => {
    const wrapper = render(<Button {...disabledProps}>Nice</Button>);
    const element = wrapper.getByText("Nice") as HTMLButtonElement;
    expect(element).toBeInTheDocument();
    expect(element.disabled).toBeTruthy();
    fireEvent.click(element);
    expect(disabledProps.onClick).not.toHaveBeenCalled();
  });
});
