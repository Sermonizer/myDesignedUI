import React, { FC, useContext, FunctionComponentElement, useState } from "react";
import classNames from "classnames";
import { MenuContext } from "./menu";
import { MenuItemProps } from "./menuItem";
import Icon from "../Icon/icon";
import Transition from "../Transition/transition";

// 下拉菜单接口
export interface SubMenuProps {
  /** 当前是否选中的标识 */
  index?: string;
  /** 下拉菜单的名称 */
  title: string;
  className?: string;
}

export const SubMenu: FC<SubMenuProps> = (props) => {
  const { index, title, children, className } = props;
  // 通过context拿到index值和mode(横向/纵向)
  const context = useContext(MenuContext);
  // 断言 传入竖直状态下默认打开的菜单
  const openedSubMenus = context.defaultOpenSubMenus as Array<string>;
  // 当menu为竖直状态时 isopened才起作用
  const isOpened =
    index && context.mode === "vertical"
      ? openedSubMenus.includes(index)
      : false;
  // 设置下拉菜单展开开关
  const [menuOpen, setOpen] = useState(isOpened);
  
  const classes = classNames("menu-item submenu-item", className, {
    "is-active": context.index === index,
    // 使纵向菜单中的icon在鼠标放上时不自动旋转 而是点击才旋转
    "is-opened": menuOpen,
    "is-vertical": context.mode === "vertical",
  });

  // 点击展开
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(!menuOpen);
  };

  // 使下拉列表能够鼠标点上去就展开，拿走就合上
  // 设置timer 使下拉栏打开/关闭更加平滑
  let timer: any;
  // toogle: 控制打开或者关闭
  const handleMouse = (e: React.MouseEvent, toggle: boolean) => {
    clearTimeout(timer);
    e.preventDefault();
    timer = setTimeout(() => {
      setOpen(toggle);
    }, 70);
  };

  // 当菜单是竖着时 用点击展开
  const clickEvents =
    context.mode === "vertical"
      ? {
          onClick: handleClick,
        }
      : {};

  // 当菜单是横着时，用鼠标放上去展开
  const hoverEvents =
    context.mode !== "vertical"
      ? {
          onMouseEnter: (e: React.MouseEvent) => {
            handleMouse(e, true);
          },
          onMouseLeave: (e: React.MouseEvent) => {
            handleMouse(e, false);
          },
        }
      : {};

  // 渲染下拉菜单里的内容
  const renderChildren = () => {
    // 使下拉菜单的class是可变的
    const subMenuClasses = classNames("submenu", {
      "menu-opened": menuOpen,
    });
    // React.Children.map(children, function[(thisArg)])
    // 如果 children 是一个数组，它将被遍历并为数组中的每个子节点调用该函数。
    // 如果子节点为 null 或是 undefined，则此方法将返回 null 或是 undefined，而不会返回数组。
    const childrenComponent = React.Children.map(children, (child, i) => {
      const childElement = child as FunctionComponentElement<MenuItemProps>;
      // subMenu下只能存放menuItem 其他元素会报错
      if (childElement.type.displayName === "MenuItem") {
        return React.cloneElement(childElement, {
          // 2-0 的形式
          index: `${index}-${i}`,
        });
      } else {
        console.error("warning: subm enu have a child not menuitem");
      }
    });

    return (
      <Transition in={menuOpen} timeout={300} classNames="zoom-in-top">
        <ul className={subMenuClasses}>{childrenComponent}</ul>
      </Transition>
    );
    // return <ul className={subMenuClasses}> {childrenComponent} </ul>;
  };

  return (
    // hover放在最外层 click放在内层
    <li key={index} className={classes} {...hoverEvents}>
      {/* 下拉菜单 title名称 */}
      <div className="submenu-title" {...clickEvents}>
        {title}
        <Icon icon="angle-down" className="arrow-icon" />
      </div>
      {/* 下拉菜单中的内容 */}
      {renderChildren()}
    </li>
  );
};

SubMenu.displayName = "SubMenu";

export default SubMenu;
