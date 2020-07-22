import React, { FC } from "react";
import MenuItem from "./menuItem";
import SubMenu from './subMenu';
export declare type MenuMode = "horizontal" | "vertical";
declare type SelectCallback = (selectedIndex: string) => void;
export interface MenuProps {
    /** 默认 active 的菜单项的索引值 */
    defaultIndex?: string;
    className?: string;
    /** 菜单展示的样式 */
    mode?: MenuMode;
    style?: React.CSSProperties;
    /** 点击菜单项触发的回调函数 */
    onSelect?: SelectCallback;
    /** 侧边栏默认展开的subMenu */
    defaultOpenSubMenus?: string[];
}
/** 在Menu组件身上绑定的静态属性 */
interface MenuProperties {
    /** MenuItem */
    Item: typeof MenuItem;
    /** SubMenu */
    SubMenu: typeof SubMenu;
}
interface IMenuContext {
    index: string;
    onSelect?: SelectCallback;
    mode?: MenuMode;
    defaultOpenSubMenus?: string[];
}
export declare const MenuContext: React.Context<IMenuContext>;
/**
 * ### 引入方式
 * ~~~js
 * import { Menu } from 'tx-design';
 * ~~~
 */
export declare const Menu: FC<MenuProps> & MenuProperties;
export default Menu;
