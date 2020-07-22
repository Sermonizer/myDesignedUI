import React, { FC, CSSProperties } from "react";
declare type MenuMode = "horizontal" | "vertical";
declare type SelectCallback = (selectedIndex: string) => void;
export interface MenuProps {
    defaultIndex?: string;
    mode?: MenuMode;
    className?: string;
    style?: CSSProperties;
    onSelect?: SelectCallback;
}
interface IMenuContext {
    index: string;
    mode?: MenuMode;
    onSelect?: SelectCallback;
}
export declare const MenuContext: React.Context<IMenuContext>;
declare const Menu: FC<MenuProps>;
export default Menu;
