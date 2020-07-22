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
import React, { useContext, useState } from "react";
import classNames from "classnames";
import { MenuContext } from "./menu";
var SubMenu = function (props) {
    var index = props.index, title = props.title, className = props.className, children = props.children;
    var _a = useState(false), menuOpen = _a[0], setMenuOpen = _a[1];
    var context = useContext(MenuContext);
    var classes = classNames("menu-item submenu-item", className, {
        "is-active": context.index === index,
    });
    var handleClick = function (e) {
        e.preventDefault();
        setMenuOpen(!menuOpen);
    };
    var timer;
    var handleMouse = function (e, toggle) {
        clearTimeout(timer);
        e.preventDefault();
        setTimeout(function () {
            setMenuOpen(toggle);
        }, 40);
    };
    var clickEvents = context.mode === "vertical" ? { onClick: handleClick } : {};
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
    var renderChildren = function () {
        var subMenuClasses = classNames("submenu", {
            "menu-opened": menuOpen,
        });
        var childComponent = React.Children.map(children, function (child, i) {
            var childElement = child;
            var displayName = childElement.type.displayName;
            if (displayName === "MenuItem") {
                return React.cloneElement(childElement, {
                    index: index + "-" + i
                });
            }
            else {
                console.error("not a MenuItem component");
            }
        });
        return React.createElement("ul", { className: subMenuClasses }, childComponent);
    };
    return (React.createElement("li", __assign({ key: index, className: classes }, hoverEvents),
        React.createElement("div", __assign({ className: "submenu-title" }, clickEvents), title),
        renderChildren()));
};
SubMenu.displayName = "subMenu";
export default SubMenu;
