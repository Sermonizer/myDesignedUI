import React, { FC, ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import classNames from "classnames";

// 利用枚举保存常量
// export enum ButtonSize {
//   Large = "lg",
//   Small = "sm",
// }

// export enum ButtonType {
//   Primary = "primary",
//   Default = "default",
//   Danger = "danger",
//   Link = "link",
// }

// 利用字符串自变量保存常量
export type ButtonSize = "lg" | "sm";

export type ButtonType = "primary" | "default" | "danger" | "link";

// 属性
interface BaseButtonProps {
  /** 添加自定义的类 */
  className?: string;
  /** 设置Button的禁用 */
  disabled?: boolean;
  /** 设置Button的大小 */
  size?: ButtonSize;
  /** 设置Button的类型 */
  btnType?: ButtonType;
  children?: React.ReactNode;
  // <a> 标签
  href?: string;
}

// 希望Button组件也能有button原先就有的属性和方法，使用react自带的方法来完成
// 类型别名
// a & b 交叉类型 既有a也有b ； a | b 联合类型 要么是a要么是b
type NativeButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLElement>;

// <a>链接的属性
type AnchorButtonProps = BaseButtonProps & AnchorHTMLAttributes<HTMLElement>;

// button和anchor（<a>链接）的方法会有不同，button的属性<a>可能无法使用，
// 因此要用ts的方法 Partial<T> 来将所有属性变成可选的
export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>;

/**
 * ### Button
 * 引入方式
 * ~~~js
 * import { Button } from "tx-design"
 * ~~~
 */
export const Button: FC<ButtonProps> = (props) => {
  // className: 用户自定义的classname
  const {
    btnType,
    className,
    disabled,
    size,
    children,
    href,
    ...restProps
  } = props;

  // classnames里面放的是类，string或者obj形式, 默认添加btn的class
  // className: 用户自定义的class
  const classes = classNames("btn", className, {
    // 可变的写法 可以是large small primary...
    [`btn-${btnType}`]: btnType,
    [`btn-${size}`]: size,
    // <a>链接的disabled添加到类属性里面 因为a本身没有disabled属性 因此如果是link 且有disabled
    // 就添加一个属性
    disabled: btnType === "link" && disabled,
  });

  if (btnType === "link" && href) {
    return (
      <a className={classes} href={href} {...restProps}>
        {children}
      </a>
    );
  } else {
    return (
      <button className={classes} disabled={disabled} {...restProps}>
        {children}
      </button>
    );
  }
};

Button.defaultProps = {
  disabled: false,
  btnType: "default",
};

export default Button;
