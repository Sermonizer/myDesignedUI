import React, { FC, useContext, CSSProperties } from "react";
import classNames from "classnames";
import { MenuContext } from "./menu";

export interface MenuItemProps {
  /** 当前是否被选中的index标识 */
  index?: string;
  /** 是否禁止点击 */
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const MenuItem: FC<MenuItemProps> = (props) => {
  const { index, disabled, className, style, children } = props;
  const context = useContext(MenuContext);
  const classes = classNames("menu-item", className, {
    "is-disabled": disabled,
    "is-active": context.index === index,
  });

  const handleClick = () => {
    if (context.onSelect && !disabled && typeof index === "string") {
      context.onSelect(index);
    }
  };
  
  return (
    <li className={classes} style={style} onClick={handleClick}>
      {children}
    </li>
  );
};

// 判断子组件的类型
MenuItem.displayName = "MenuItem";

export default MenuItem;
