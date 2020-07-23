import React, { FC, useState, createContext } from "react";
import classNames from "classnames";
import MenuItem, { MenuItemProps } from "./menuItem";
import SubMenu, { SubMenuProps } from "./subMenu";

// 字符串字面量
export type MenuMode = "horizontal" | "vertical";
// 回调函数复用
type SelectCallback = (selectedIndex: string) => void;

// 当menu竖着时，子菜单默认展开
export interface MenuProps {
  /** 默认 active 的菜单项的索引值 */
  defaultIndex?: string;
  className?: string;
  /** 菜单展示的样式 */
  mode?: MenuMode;
  style?: React.CSSProperties;
  /** 点击菜单项触发的回调函数 */
  onSelect?: SelectCallback;
  /** 竖着时侧边栏默认展开 */
  defaultOpenSubMenus?: string[]; // string[]里存放要展开的index
}

/** 在Menu组件身上绑定的静态属性 */
interface MenuProperties {
  /** MenuItem */
  Item: typeof MenuItem;
  /** SubMenu */
  SubMenu: typeof SubMenu;
}

// 传递属性的接口
interface IMenuContext {
  index: string;
  onSelect?: SelectCallback;
  mode?: MenuMode;
  defaultOpenSubMenus?: string[];
}

// 要给子组件用,要导出
export const MenuContext = createContext<IMenuContext>({ index: "0" });

/**
 * ### 引入方式
 * ~~~js
 * import { Menu } from 'tx-design';
 * ~~~
 */
export const Menu: FC<MenuProps> & MenuProperties = (props) => {
  const {
    className,
    mode,
    style,
    children,
    defaultIndex,
    defaultOpenSubMenus,
    onSelect,
  } = props;

  // 点击高亮,从父组件传递属性,保存当前高亮的index
  const [currentActive, setActive] = useState(defaultIndex);

  const classes = classNames("menu", className, {
    "menu-vertical": mode === "vertical",
    "menu-horizontal": mode !== "vertical",
  });

  /**
   *  点击之后高亮的菜单会变化
   *  1. 更改高亮的index
   *  2. 调用onSelect函数, 用户可以进行自定义操作
   */

  const handleClick = (index: string) => {
    setActive(index);
    // 判断onSelect是否存在
    if (onSelect) {
      onSelect(index);
    }
  };

  // 通过context将属性传递给子组件
  const passedContext: IMenuContext = {
    index: currentActive ? currentActive : "0",
    onSelect: handleClick,
    mode,
    defaultOpenSubMenus,
  };

  /**
   * 任务1：判断子组件的类型 从而操控子组件
   *    由于没有对子组件的类型进行限制，因此任何元素都能当成Menu的子组件传入，
   *    因此希望对Menu的子组件类型进行判断，只有传入MenuItem时才进行渲染
   *
   * 任务2：给子组件添加index属性，不用每次手动添加
   *    给子组件自动添加index属性 用到了cloneElement(element, [props])
   *    以element元素为样版 并返回新的React元素 返回元素的props是原始元素与传入的
   *    props浅层合并的结果 新的元素会取代旧的元素 此时menuItem的index就设置为可选
   */
  // renderChildren： 循环渲染组件
  const renderChildren = () => {
    return React.Children.map(children, (child, index) => {
      // child是ReactNode类型, 没有displayName属性, 因此要进行类型断言, 转换成FunctionComponent实例才能确定类型
      const childElement = child as React.FunctionComponentElement<
        MenuItemProps
      >;
      // 拿到子组件的类型 是MenuItem才渲染
      const { displayName } = childElement.type;
      if (displayName === "MenuItem" || displayName === "SubMenu") {
        // 给子组件添加index属性
        return React.cloneElement(childElement, { index: index.toString() });
      } else {
        console.error("warning: Menu have a child not MenuItem");
      }
    });
  };

  return (
    // jest推荐给节点添加data-testid来获取该节点
    <ul className={classes} style={style} data-testid={"test-menu"}>
      <MenuContext.Provider value={passedContext}>
        {renderChildren()}
      </MenuContext.Provider>
    </ul>
  );
};

Menu.Item = MenuItem;

Menu.SubMenu = SubMenu;

Menu.defaultProps = {
  defaultIndex: "0",
  mode: "horizontal",
  defaultOpenSubMenus: [],
};

export default Menu;
