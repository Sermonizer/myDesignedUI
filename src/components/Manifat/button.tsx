import React, { FC, ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import classNames from "classnames";

// button组件：btntype，size, disabled, onClick
export type ButtonType = "primary" | "danger" | "default" | "link";
export type ButtonSize = "lg" | "sm";

interface BaseButtonProps {
  className?: string;
  btnType?: ButtonType;
  size?: ButtonSize;
  disabled?: boolean;
  children?: React.ReactNode;
  href?: string;
}

type NativeButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLElement>

type AnchorButtonProps = BaseButtonProps & AnchorHTMLAttributes<HTMLElement>

export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>

export const Button: FC<ButtonProps> = (props) => {
  const { btnType, size, disabled, className, children, href, ...restProps } = props

  const classes = classNames("btn", className, {
    [`btn-${btnType}`]: btnType,
    [`btn-${size}`]: size,
    disabled: btnType === "link" && disabled
  })

  if (btnType === "link" && href) {
    return (
      <a href={href} className={classes} {...restProps}>{children}</a>
    )
  } else {
    return (
      <button className={classes} disabled={disabled} {...restProps}>
        {children}
      </button>
    )
  }
} 

Button.defaultProps = {
  disabled: false,
  btnType: "default"
}

export default Button