import React, { useState } from "react";
import classNames from "classnames";
// 实现拖拽上传文件
export var Dragger = function (props) {
    var onFile = props.onFile, children = props.children;
    /** 拖动完成的状态 */
    var _a = useState(false), dragOver = _a[0], setDragOver = _a[1];
    var cnames = classNames("uploader-dragger", {
        "is-dragover": dragOver,
    });
    // DragEvent是React的对象，不是原生的，因此可以加入泛型
    var handleDrag = function (e, over) {
        e.preventDefault();
        setDragOver(over);
    };
    var handleDrop = function (e) {
        e.preventDefault();
        setDragOver(false);
        onFile(e.dataTransfer.files);
    };
    return (React.createElement("div", { className: cnames, onDragOver: function (e) {
            handleDrag(e, true);
        }, onDragLeave: function (e) {
            handleDrag(e, false);
        }, onDrop: handleDrop }, children));
};
export default Dragger;
