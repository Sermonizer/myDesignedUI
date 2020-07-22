import React, { createContext } from "react";
import classNames from "classnames";
import { useState } from "@storybook/addons";
export var MenuContext = createContext({
    index: "0",
});
var Menu = function (props) {
    var defaultIndex = props.defaultIndex, mode = props.mode, className = props.className, style = props.style, onSelect = props.onSelect, children = props.children;
    var _a = useState(defaultIndex), currentActive = _a[0], setActive = _a[1];
    var handleCLick = function (index) {
        setActive(index);
        if (onSelect) {
            onSelect(index);
        }
    };
    var passedContext = {
        index: currentActive ? currentActive : "0",
        onSelect: handleCLick,
    };
    var classes = classNames("menu", className, {
        "menu-vertical": mode === "vertical",
        "menu-horizontal": mode !== "vertical",
    });
    var renderChildren = function () {
        return React.Children.map(children, function (child, index) {
            var childElement = child;
            var displayName = childElement.type.displayName;
            if (displayName === "MenuItem") {
                return React.cloneElement(childElement, {
                    index: index.toString()
                });
            }
            else {
                console.error("not a MenuItem Element");
            }
        });
    };
    return (React.createElement("ul", { className: classes, style: style },
        React.createElement(MenuContext.Provider, { value: passedContext }, renderChildren())));
};
Menu.defaultProps = {
    defaultIndex: "0",
    mode: "horizontal",
};
export default Menu;
