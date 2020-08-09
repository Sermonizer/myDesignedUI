import React, { FC, useRef, ChangeEvent, useState } from "react";
import axios from "axios";
import UploadList from "./uploadList";
import Dragger from "./dragger";
// 文件上传状态
export type UploadFileStatus = "ready" | "uploading" | "success" | "error";
// 实现一个更完整的File接口
export interface UploadFile {
  /** 文件ID */
  uid: string;
  /** 文件大小 */
  size: number;
  /** 文件名 */
  name: string;
  /** 上传状态 */
  status?: UploadFileStatus;
  /** 上传进度 */
  percent?: number; 
  /** 源文件 */
  raw?: File;
  /** 上传成功的响应 */
  response?: any; 
  /** 上传失败的错误响应 */
  error?: any; 
}
export interface UploadProps {
  /** 发送到的http/https接口地址 */
  action: string;
  /** 默认的文件列表 */
  defaultFileList?: UploadFile[];
  /** 自定义的请求头 */
  headers?: Record<string, any>;
  /** 自定义的文件名  name */
  name?: string;
  /** 用户自定义的数据 */
  data?: { [key: string]: any };
  /** 是否携带cookie */
  withCredentials?: boolean;
  /** input本身的file约束属性 */
  /** 约束，只能上传什么文件 */
  accept?: string;
  /** 是否上传多个文件 */
  multiple?: boolean;
  /** 是否拖动上传 */
  drag?: boolean;
  /** 文件上传前的操作 */
  beforeUpload?: (file: UploadFile) => boolean | Promise<UploadFile>;
  /** 文件进度调用方法 */
  onProgress?: (percentage: number, file: UploadFile) => void;
  /** 文件上传了触发的方法 */
  onChange?: (file: UploadFile) => void;
  /** 上传成功 data: 服务器返回的数据*/
  onSuccess?: (data: any, file: UploadFile) => void;
  /** 上传失败 */
  onError?: (err: any, file: UploadFile) => void;
  /** 删除文件 */
  onRemove?: (file: UploadFile) => void;
}

/**
 * ### 引入方式
 * ~~~js
 * import { Upload } from "tx-design"
 * ~~~
 */
export const Upload: FC<UploadProps> = (props) => {
  const {
    action,
    defaultFileList, // 用户可以自定义默认显示的文件列表
    name,
    headers,
    data,
    withCredentials,
    accept,
    multiple,
    children,
    drag,
    beforeUpload,
    onProgress,
    onSuccess,
    onError,
    onChange,
    onRemove, // 用户删除文件时触发
  } = props;
  // 用于拿到DOM节点
  const fileInput = useRef<HTMLInputElement>(null);

  const [fileList, setFileList] = useState<UploadFile[]>(defaultFileList || []);
  // 更新文件数组的方法 updateFile: 更新哪些文件；updateObj: 更新文件中的哪些值
  const updateFileList = (
    updateFile: UploadFile,
    updateObj: Partial<UploadFile>
  ) => {
    setFileList((prevList: any[]) => {
      return prevList.map((file) => {
        if (file.uid === updateFile.uid) {
          return { ...file, ...updateObj };
        } else {
          return file;
        }
      });
    });
  };
  const handleClick = () => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
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
  const handleRemove = (file: UploadFile) => {
    setFileList((prevList) => {
      // 返回一个删除目标文件后的新的Array
      return prevList.filter((item) => item.uid !== file.uid);
    });
    if (onRemove) {
      onRemove(file);
    }
  };
  // 上传文件
  const uploadFiles = (files: FileList) => {
    // 因为files是FileList类型，是类数组，因此先转换为数组
    let postFiles = Array.from(files);
    postFiles.forEach((file) => {
      // 创建新的UploadFile
      const newFile: UploadFile = {
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
      } else {
        const result = beforeUpload(newFile);
        // 文件转换
        if (result && result instanceof Promise) {
          result.then((processedFile) => {
            post(file);
          });
        } else if (result !== false) {
          post(file);
        }
      }
    });
  };
  // 文件上传的整个过程都放在post函数中
  const post = (file: File) => {
    // 上传开始时更新FileList
    let _file: UploadFile = {
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

    setFileList((prevList) => {
      return [_file, ...prevList];
    });
    const formData = new FormData();
    // name存在就用name,不存在就用file代替
    formData.append(name || "file", file);
    // 添加更多的formData
    if (data) {
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
    }
    axios
      .post(action, formData, {
        // 添加headers
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
        // Post时是否携带cookies,axios自带的属性
        withCredentials,
        // 计算上传百分比
        onUploadProgress: (e) => {
          let percentage = Math.round((e.loaded * 100) / e.total) || 0;
          if (percentage < 100) {
            updateFileList(_file, { percent: percentage, status: "uploading" });
            if (onProgress) {
              onProgress(percentage, _file);
            }
          }
        },
        // 计算成功时的回调
      })
      .then((resp) => {
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
      .catch((err) => {
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

  return (
    <div className="upload-component">
      <div
        className="upload-input"
        style={{ display: "inline-block" }}
        onClick={handleClick}
      >
        {drag ? (
          <Dragger
            onFile={(files) => {
              uploadFiles(files);
            }}
          >
            {children}
          </Dragger>
        ) : (
          children
        )}
        <input
          className="file-input"
          style={{ display: "none" }}
          // 创建ref，以拿到input的DOM节点
          ref={fileInput}
          // 在onChange的生命周期来选择文件
          onChange={handleFileChange}
          type="file"
          accept={accept}
          multiple={multiple}
        />
      </div>

      <UploadList fileList={fileList} onRemove={handleRemove} />
    </div>
  );
};

// 默认属性
Upload.defaultProps = {
  name: "file",
};
export default Upload;
