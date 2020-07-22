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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import React, { useRef, useState } from "react";
import axios from "axios";
import UploadList from "./uploadList";
import Dragger from "./dragger";
/**
 * ### 引入方式
 * ~~~js
 * import { Upload } from "tx-design"
 * ~~~
 */
export var Upload = function (props) {
    var action = props.action, defaultFileList = props.defaultFileList, // 用户可以自定义默认显示的文件列表
    name = props.name, headers = props.headers, data = props.data, withCredentials = props.withCredentials, accept = props.accept, multiple = props.multiple, children = props.children, drag = props.drag, beforeUpload = props.beforeUpload, onProgress = props.onProgress, onSuccess = props.onSuccess, onError = props.onError, onChange = props.onChange, onRemove = props.onRemove;
    // 用于拿到DOM节点
    var fileInput = useRef(null);
    var _a = useState(defaultFileList || []), fileList = _a[0], setFileList = _a[1];
    // 更新文件数组的方法 updateFile: 更新哪些文件；updateObj: 更新文件中的哪些值
    var updateFileList = function (updateFile, updateObj) {
        setFileList(function (prevList) {
            return prevList.map(function (file) {
                if (file.uid === updateFile.uid) {
                    return __assign(__assign({}, file), updateObj);
                }
                else {
                    return file;
                }
            });
        });
    };
    var handleClick = function () {
        if (fileInput.current) {
            fileInput.current.click();
        }
    };
    var handleFileChange = function (e) {
        var files = e.target.files;
        if (!files) {
            return;
        }
        // 上传file的方法
        uploadFiles(files);
        // 当上传结束后，把fileInput中的值清空
        if (fileInput.current) {
            fileInput.current.value = "";
        }
    };
    // 删除文件的函数
    var handleRemove = function (file) {
        setFileList(function (prevList) {
            // 返回一个删除目标文件后的新的Array
            return prevList.filter(function (item) { return item.uid !== file.uid; });
        });
        if (onRemove) {
            onRemove(file);
        }
    };
    // 上传文件
    var uploadFiles = function (files) {
        // 因为files是FileList类型，是类数组，因此先转换为数组
        var postFiles = Array.from(files);
        postFiles.forEach(function (file) {
            // 创建新的UploadFile
            var newFile = {
                uid: Date.now() + "upload-file",
                status: "ready",
                name: file.name,
                size: file.size,
                percent: 0,
                raw: file,
            };
            // 没有beforeUpload，直接上传就可以了
            if (!beforeUpload) {
                post(file);
            }
            else {
                var result = beforeUpload(newFile);
                // 文件转换
                if (result && result instanceof Promise) {
                    result.then(function (processedFile) {
                        post(file);
                    });
                }
                else if (result !== false) {
                    post(file);
                }
            }
        });
    };
    // 文件上传的整个过程都放在post函数中
    var post = function (file) {
        // 上传开始时更新FileList
        var _file = {
            // 用当前时间作为文件ID
            uid: Date.now() + "upload-file",
            status: "ready",
            name: file.name,
            size: file.size,
            percent: 0,
            raw: file,
        };
        // 当选择多个文件上传时,只能获取到最后一个上传的文件
        // setFileList([_file, ...fileList])
        setFileList(function (prevList) {
            return __spreadArrays([_file], prevList);
        });
        var formData = new FormData();
        // name存在就用name,不存在就用file代替
        formData.append(name || "file", file);
        // 添加更多的formData
        if (data) {
            Object.keys(data).forEach(function (key) {
                formData.append(key, data[key]);
            });
        }
        axios
            .post(action, formData, {
            // 添加headers
            headers: __assign(__assign({}, headers), { "Content-Type": "multipart/form-data" }),
            // Post时是否携带cookies,axios自带的属性
            withCredentials: withCredentials,
            // 计算上传百分比
            onUploadProgress: function (e) {
                var percentage = Math.round((e.loaded * 100) / e.total) || 0;
                if (percentage < 100) {
                    updateFileList(_file, { percent: percentage, status: "uploading" });
                    if (onProgress) {
                        onProgress(percentage, _file);
                    }
                }
            },
        })
            .then(function (resp) {
            // 给上传成功时添加updateFileList
            updateFileList(_file, { status: "success", response: resp.data });
            if (onSuccess) {
                // resp.data: 服务器返回的数据
                onSuccess(resp.data, _file);
            }
            if (onChange) {
                onChange(_file);
            }
        })
            .catch(function (err) {
            // 给上传失败时添加updateFileList
            updateFileList(_file, { status: "error", error: err });
            if (onError) {
                onError(err, _file);
            }
            if (onChange) {
                onChange(_file);
            }
        });
    };
    return (React.createElement("div", { className: "viking-upload-component" },
        React.createElement("div", { className: "viking-upload-input", style: { display: "inline-block" }, onClick: handleClick },
            drag ? (React.createElement(Dragger, { onFile: function (files) {
                    uploadFiles(files);
                } }, children)) : (children),
            React.createElement("input", { className: "viking-file-input", style: { display: "none" }, 
                // 创建ref，以拿到input的DOM节点
                ref: fileInput, 
                // 在onChange的生命周期来选择文件
                onChange: handleFileChange, type: "file", accept: accept, multiple: multiple })),
        React.createElement(UploadList, { fileList: fileList, onRemove: handleRemove })));
};
// 默认属性
Upload.defaultProps = {
    name: "file",
};
export default Upload;
