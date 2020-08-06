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
import React, { useState, useEffect, useRef, } from "react";
import classNames from "classnames";
import useDebounce from "../../hooks/useDebounce";
import useClickOutside from "../../hooks/useClickOutside";
import Input from "../Input/input";
import Transition from "../Transition/transition";
import Icon from "../Icon/icon";
import { library } from "@fortawesome/fontawesome-svg-core";
// 引入全部图标
import { fas } from "@fortawesome/free-solid-svg-icons";
library.add(fas);
/**
 * ### 引入方式
 * ~~~js
 * import { AutoComplete } from "tx-design"
 * ~~~
 */
export var AutoComplete = function (props) {
    var fetchSuggestions = props.fetchSuggestions, onSelect = props.onSelect, renderOption = props.renderOption, 
    // inputValue的初始值
    value = props.value, restProps = __rest(props, ["fetchSuggestions", "onSelect", "renderOption", "value"]);
    // 定义输入的值
    var _a = useState(value), inputValue = _a[0], setInputValue = _a[1];
    // 操作下拉菜单里的数据
    var _b = useState([]), Suggestions = _b[0], setSuggestions = _b[1];
    // 当fetch请求数据时 增加一个icon样式 显示正在请求
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    // 展示下拉菜单
    var _d = useState(false), showDropdown = _d[0], setShowDropdown = _d[1];
    // 异步 自定义hook
    var debouncedValue = useDebounce(inputValue, 500);
    // 下拉菜单高亮
    var _e = useState(-1), highlightIndex = _e[0], setHighlightIndex = _e[1];
    // 希望在选中数据后 不会再进行一次搜索
    var triggerSearch = useRef(false);
    // 指向组件的Dom节点 传入泛型 因为最外层是div
    var componentRef = useRef(null);
    // 点击窗口其他位置 使下拉框关闭
    useClickOutside(componentRef, function () {
        setShowDropdown(false);
    });
    // 多次输入时 需要做防抖
    useEffect(function () {
        // 当value改变且trigger为true时才触发搜索的逻辑
        if (debouncedValue && triggerSearch.current) {
            setSuggestions([]);
            var results = fetchSuggestions(debouncedValue);
            // 异步的实现
            if (results instanceof Promise) {
                // console.log("trigger");
                setLoading(true);
                results.then(function (data) {
                    setLoading(false);
                    setSuggestions(data);
                    if (data.length > 0) {
                        setShowDropdown(true);
                    }
                });
            }
            else {
                setSuggestions(results);
                setShowDropdown(true);
                if (results.length > 0) {
                    setShowDropdown(true);
                }
            }
        }
        else {
            setShowDropdown(false);
        }
        // 在选中某一项后，将默认高亮值设置为-1，避免出现高亮值跟上次选择时相同的情况
        setHighlightIndex(-1);
    }, [debouncedValue, fetchSuggestions]);
    // 设置下拉菜单中高亮的项
    var highlight = function (index) {
        // 设置高亮的范围 不能一直往上\下按
        if (index < 0)
            index = 0;
        if (index >= Suggestions.length) {
            index = Suggestions.length - 1;
        }
        // 设置高亮
        setHighlightIndex(index);
    };
    // 处理input输入框的改变
    var handleChange = function (e) {
        var value = e.target.value.trim();
        setInputValue(value);
        // 当handleChange时希望trigger的值变为true
        triggerSearch.current = true;
    };
    // 将点击的下拉菜单中的值填充到input中，并且隐藏下拉菜单
    var handleSelect = function (item) {
        // item是Object,因此要取它的value
        setInputValue(item.value);
        setShowDropdown(false);
        if (onSelect) {
            onSelect(item);
        }
        // 当handleSelect时希望trigger的值变为false 不去触发搜索
        triggerSearch.current = false;
    };
    // 处理键盘事件
    var handleKeyDown = function (e) {
        switch (e.keyCode) {
            // 回车
            case 13:
                if (Suggestions[highlightIndex]) {
                    handleSelect(Suggestions[highlightIndex]);
                }
                break;
            // 向上
            case 38:
                highlight(highlightIndex - 1);
                break;
            // 向下
            case 40:
                highlight(highlightIndex + 1);
                break;
            // esc
            case 27:
                setShowDropdown(false);
                break;
            default:
                break;
        }
    };
    // 判断用户是否自定义模板样式
    var renderTemplate = function (item) {
        return renderOption ? renderOption(item) : item.value;
    };
    // 显示下拉数据
    var generateDropdown = function () {
        return (React.createElement(Transition, { in: showDropdown || loading, animation: "zoom-in-top", timeout: 300, onExited: function () {
                setSuggestions([]);
            } },
            React.createElement("ul", { className: "suggestion-list" },
                loading && (React.createElement("div", { className: "suggstions-loading-icon" },
                    React.createElement(Icon, { icon: "spinner", spin: true }))),
                Suggestions.map(function (item, index) {
                    var cnames = classNames("suggestion-item", {
                        "is-active": index === highlightIndex,
                    });
                    return (React.createElement("li", { key: index, className: cnames, onClick: function () { return handleSelect(item); } }, renderTemplate(item)));
                }))));
    };
    //   return (
    //     <ul>
    //       {Suggestions.map((item, index) => {
    //         const cnames = classNames("suggestion-item", {
    //           "item-highlighted": index === highlightIndex,
    //         });
    //         return (
    //           <li
    //             key={index}
    //             className={cnames}
    //             onClick={() => handleSelect(item)}
    //           >
    //             {renderTemplate(item)}
    //           </li>
    //         );
    //       })}
    //     </ul>
    //   );
    // };
    return (React.createElement("div", { className: "auto-complete", ref: componentRef },
        React.createElement(Input, __assign({ value: inputValue, onChange: handleChange, 
            // 添加键盘事件 能够上下键 enter esc
            onKeyDown: handleKeyDown }, restProps)),
        generateDropdown()));
};
export default AutoComplete;
