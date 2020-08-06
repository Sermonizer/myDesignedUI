var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React, { useContext, useState, } from "react";
import classNames from "classnames";
import { MenuContext } from "./menu";
import Icon from "../Icon/icon";
import Transition from "../Transition/transition";
export var SubMenu = function (props) {
    var index = props.index, title = props.title, children = props.children, className = props.className;
    // 通过context拿到index值和mode(横向/纵向)
    var context = useContext(MenuContext);
    // 类型断言 传入竖直状态下默认打开的子菜单数组
    var openedSubMenus = context.defaultOpenSubMenus;
    // isOpened: 判断是否要展开SubMenu，替换掉下拉菜单展开的menuOpen参数
    var isOpened = index && context.mode === "vertical"
        ? openedSubMenus.includes(index)
        : false;
    // 设置下拉菜单展开开关
    var _a = useState(isOpened), menuOpen = _a[0], setOpen = _a[1];
    var classes = classNames("menu-item submenu-item", className, {
        "is-active": context.index === index,
        // 使纵向菜单中的icon在鼠标放上时不自动旋转 而是点击才旋转
        "is-opened": menuOpen,
        "is-vertical": context.mode === "vertical",
    });
    // 点击展开
    var handleClick = function (e) {
        e.preventDefault();
        setOpen(!menuOpen);
    };
    // 使下拉列表能够鼠标点上去就展开，拿走就合上
    // 设置timer 使下拉栏打开/关闭更加平滑
    var timer;
    // toogle: 控制打开或者关闭
    var handleMouse = function (e, toggle) {
        clearTimeout(timer);
        e.preventDefault();
        timer = setTimeout(function () {
            setOpen(toggle);
        }, 70);
    };
    // 当菜单是竖着时 用点击展开
    var clickEvents = context.mode === "vertical"
        ? {
            onClick: handleClick,
        }
        : {};
    // 当菜单是横着时，用鼠标放上去展开
    var hoverEvents = context.mode !== "vertical"
        ? {
            onMouseEnter: function (e) {
                handleMouse(e, true);
            },
            onMouseLeave: function (e) {
                handleMouse(e, false);
            },
        }
        : {};
    // 渲染下拉菜单里的内容
    var renderChildren = function () {
        // 使下拉菜单的class是可变的
        var subMenuClasses = classNames("submenu", {
            "menu-opened": menuOpen,
        });
        // React.Children.map(children, function[(thisArg)])
        // 如果 children 是一个数组，它将被遍历并为数组中的每个子节点调用该函数。
        // 如果子节点为 null 或是 undefined，则此方法将返回 null 或是 undefined，而不会返回数组。
        var childrenComponent = React.Children.map(children, function (child, i) {
            var childElement = child;
            // subMenu下只能存放menuItem 其他元素会报错
            if (childElement.type.displayName === "MenuItem") {
                return React.cloneElement(childElement, {
                    // 2-0 的形式
                    index: index + "-" + i,
                });
            }
            else {
                console.error("warning: subm enu have a child not menuitem");
            }
        });
        return (React.createElement(Transition, { in: menuOpen, timeout: 300, classNames: "zoom-in-top" },
            React.createElement("ul", { className: subMenuClasses }, childrenComponent)));
        // return <ul className={subMenuClasses}> {childrenComponent} </ul>;
    };
    return (
    // hover放在最外层的li上面，click放在title上面
    React.createElement("li", __assign({ key: index, className: classes }, hoverEvents),
        React.createElement("div", __assign({ className: "submenu-title" }, clickEvents),
            title,
            React.createElement(Icon, { icon: "angle-down", className: "arrow-icon" })),
        renderChildren()));
};
SubMenu.displayName = "SubMenu";
export default SubMenu;
