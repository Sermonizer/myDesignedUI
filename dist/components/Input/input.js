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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React from "react";
import classNames from "classnames";
import Icon from "../Icon/icon";
/**
 * ### 引入方式
 * ~~~js
 * import { Input } from "tx-design"
 * ~~~
 */
export var Input = function (props) {
    var _a;
    // 取出需要的属性
    var disabled = props.disabled, size = props.size, icon = props.icon, prepend = props.prepend, append = props.append, style = props.style, restProps = __rest(props, ["disabled", "size", "icon", "prepend", "append", "style"]);
    // 根据属性计算不同的classname
    var classes = classNames("input-wrapper", (_a = {},
        _a["input-size-" + size] = size,
        _a["is-disabled"] = disabled,
        _a["input-group"] = prepend || append,
        // !! 强制转换为boolean类型
        _a["input-group-append"] = !!append,
        _a["input-group-prepend"] = !!prepend,
        _a));
    // 希望受控组件不会变成非受控组件
    var fixControlledValue = function (value) {
        if (typeof value === "undefined" || value === null) {
            // 为value设置初始值
            return "";
        }
        return value;
    };
    /**
     * 非受控组件使用defaultValue来表示组件的默认状态
     * 只能有一个value 有了value defaultvalue就不能存在了
     */
    if ("value" in props) {
        delete restProps.defaultValue;
        restProps.value = fixControlledValue(props.value);
    }
    return (
    // 根据属性判断是否添加特定的节点
    React.createElement("div", { className: classes, style: style },
        prepend && React.createElement("div", { className: "input-group-prepend" }, prepend),
        icon && (React.createElement("div", { className: "icon-wrapper" },
            React.createElement(Icon, { icon: icon, title: "title-" + icon }))),
        React.createElement("input", __assign({ className: "input-inner", disabled: disabled }, restProps)),
        append && React.createElement("div", { className: "input-group-append" }, append)));
};
export default Input;
