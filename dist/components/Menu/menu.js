import React, { useState, createContext } from "react";
import classNames from "classnames";
import MenuItem from "./menuItem";
import SubMenu from "./subMenu";
// 要给子组件用,要导出
export var MenuContext = createContext({ index: "0" });
/**
 * ### 引入方式
 * ~~~js
 * import { Menu } from 'tx-design';
 * ~~~
 */
export var Menu = function (props) {
    var className = props.className, mode = props.mode, style = props.style, children = props.children, defaultIndex = props.defaultIndex, defaultOpenSubMenus = props.defaultOpenSubMenus, onSelect = props.onSelect;
    // 点击高亮,从父组件传递属性,保存当前高亮的index
    var _a = useState(defaultIndex), currentActive = _a[0], setActive = _a[1];
    var classes = classNames("menu", className, {
        "menu-vertical": mode === "vertical",
        "menu-horizontal": mode !== "vertical",
    });
    /**
     *  点击之后高亮的菜单会变化
     *  1. 更改高亮的index
     *  2. 调用onSelect函数, 用户可以进行自定义操作
     */
    var handleClick = function (index) {
        setActive(index);
        // 判断onSelect是否存在
        if (onSelect) {
            onSelect(index);
        }
    };
    // 通过context将属性传递给子组件
    var passedContext = {
        index: currentActive ? currentActive : "0",
        onSelect: handleClick,
        mode: mode,
        defaultOpenSubMenus: defaultOpenSubMenus,
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
    var renderChildren = function () {
        return React.Children.map(children, function (child, index) {
            // child是ReactNode类型, 没有displayName属性, 因此要进行类型断言, 转换成FunctionComponent实例才能确定类型
            var childElement = child;
            // 拿到子组件的类型 是MenuItem才渲染
            var displayName = childElement.type.displayName;
            if (displayName === "MenuItem" || displayName === "SubMenu") {
                // 给子组件添加index属性
                return React.cloneElement(childElement, { index: index.toString() });
            }
            else {
                console.error("warning: Menu have a child not MenuItem");
            }
        });
    };
    return (
    // jest推荐给节点添加data-testid来获取该节点
    React.createElement("ul", { className: classes, style: style, "data-testid": "test-menu" },
        React.createElement(MenuContext.Provider, { value: passedContext }, renderChildren())));
};
Menu.Item = MenuItem;
Menu.SubMenu = SubMenu;
Menu.defaultProps = {
    defaultIndex: "0",
    mode: "horizontal",
    defaultOpenSubMenus: [],
};
export default Menu;
