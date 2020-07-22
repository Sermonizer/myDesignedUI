import { FC } from "react";
export interface SubMenuProps {
    /** 当前是否选中的标识 */
    index?: string;
    /** 下拉菜单的名称 */
    title: string;
    className?: string;
}
export declare const SubMenu: FC<SubMenuProps>;
export default SubMenu;
