import React from "react";
/**
 * ### 引入方式
 * ~~~js
 * import { Progress } from "tx-design"
 * ~~~
 */
export var Progress = function (props) {
    var percent = props.percent, strokeHeight = props.strokeHeight, showText = props.showText, styles = props.styles, theme = props.theme;
    return (React.createElement("div", { className: "progress-bar", style: styles },
        React.createElement("div", { className: "progress-bar-outer", 
            // 添加动态高度
            style: { height: strokeHeight + "px" } },
            React.createElement("div", { className: "progress-bar-inner color-" + theme, style: { width: percent + "%" } }, showText && React.createElement("span", { className: "inner-text" }, percent + "%")))));
};
// 进度条的默认值
Progress.defaultProps = {
    strokeHeight: 15,
    showText: true,
    theme: "primary",
};
export default Progress;
