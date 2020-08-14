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
  /** 默认显示的文件列表 */
  defaultFileList?: UploadFile[];
  /** 用户自定义的请求头 */
  headers?: Record<string, any>; // Record: 用来拷贝属性，将headers的string类型改为any类型
  /** 用户自定义的文件名name */
  name?: string;
  /** 用户自定义的数据 */
  data?: { [key: string]: any };
  /** Post发送时是否携带cookie */
  withCredentials?: boolean;
  /** input本身的file约束属性
   * 允许上传文件的类型 */
  accept?: string;
  /** 是否支持上传多个文件 */
  multiple?: boolean;
  /** 是否支持拖动上传 */
  drag?: boolean;
  /** 文件上传前的操作，用来完成验证或者文件转换 */
  beforeUpload?: (file: UploadFile) => boolean | Promise<UploadFile>;
  /** 文件进度改变时调用的方法 */
  onProgress?: (percentage: number, file: UploadFile) => void;
  /** 文件上传时触发的方法 */
  onChange?: (file: UploadFile) => void;
  /** 上传成功 (data: 服务器返回的数据)*/
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
    defaultFileList, // 用户自定义默认显示的文件列表
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

  // 由于真正上传文件的是input，但是input被隐藏了，因此为其设置一个ref，
  // 使用useRef来获取该节点
  const fileInput = useRef<HTMLInputElement>(null);
  // 上传文件的列表
  const [fileList, setFileList] = useState<UploadFile[]>(defaultFileList || []);
  // 更新文件列表的方法 updateFile: 更新的文件；updateObj: 要更新的文件中的数据
  const updateFileList = (
    updateFile: UploadFile,
    // Partial：更新文件中任意项都可以
    updateObj: Partial<UploadFile>
  ) => {
    /**
     * 如果setFileList(file)，由于是异步更新的文件，无法拿到最新的状态。
     * 如果新的 state 需要通过使用先前的 state 计算得出，
     * 那么可以将函数传递给 setState。该函数将接收先前的 state，并返回一个更新后的值。
     * 
     * 而更新列表的某一项时返回的是一个新的列表，而不是在原列表上进行更改。
     * 因为调用 State Hook 的更新函数并传入当前的 state 时，React 将跳过子组件的渲染及 effect 的执行。
     * （因为React 使用 Object.is 比较算法 来比较 state。）
     */
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
  // 当input节点存在，就调用input的click事件
  const handleClick = () => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  };
  // 当input发生变化时，开始选择文件
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    // 如果没有文件，说明没有选择文件上传，就return掉
    if (!files) {
      return;
    }
    uploadFiles(files); // 如果files存在，就上传files
    // 当上传结束后，将fileInput中的值清空
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

  // 文件上传的整个过程都放在post函数中
  const post = (file: UploadFile) => {
    // 这么写会有bug，当上传多个文件时只能获取到最后一个上传的文件，因此需要函数式更新state
    // setFileList([_file, ...fileList])
    setFileList((prevList) => {
      return [file, ...prevList];
    });
    // FormData 接口提供了一种表示表单数据的键值对的构造方式，经过它的数据可以使用了XMLHttpRequest.send()方法送出
    const formData = new FormData();  // 通过FormData对象来模拟表单数据
    formData.append(name!, file.raw!);  // name存在就用name,不存在就用原始file代替,ts属性后面加！代表非空断言(!null, !undefined)
    // 添加更多的formData
    if (data) {
      // data是个key: value形式对象，循环添加进formData
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
    }
    axios
      .post(action, formData, {
        headers: { // 添加自定义headers
          ...headers,
          "Content-Type": "multipart/form-data", // 这个属性对应form的encType属性
        },
        withCredentials, // Post时是否携带cookies,axios自带的属性
        onUploadProgress: (e) => { // 计算上传百分比，axios自带的文件上传进度
          let percentage = Math.round((e.loaded * 100) / e.total) || 0;
          if (percentage < 100) {
            updateFileList(file, { percent: percentage, status: "uploading" });
            if (onProgress) {
              onProgress(percentage, file);
            }
          }
        },
      })
      .then((resp) => { // 上传成功时的回调
        // 给上传成功时添加updateFileList
        updateFileList(file, { status: "success", response: resp.data }); 
        if (onSuccess) {
          onSuccess(resp.data, file); // resp.data: 服务器返回的数据
        }
        if (onChange) {
          onChange(file);
        }
      })
      .catch((err) => {
        // 给上传失败时添加updateFileList
        updateFileList(file, { status: "error", error: err });
        if (onError) {
          onError(err, file);
        }
        if (onChange) {
          onChange(file);
        }
      });
  };

  // 上传文件的函数
  const uploadFiles = (files: FileList) => {
    let postFiles = Array.from(files); // 因为files是FileList类型，是类数组，因此先转换为数组
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
      if (!beforeUpload) {  // 没有beforeUpload，直接上传就可以了
        post(newFile);
      } else {
        const result = beforeUpload(newFile);
        if (result && result instanceof Promise) {  // 文件转换
          result.then((processedFile) => {
            post(processedFile);
          });
        } else if (result !== false) {
          post(newFile);
        }
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
        {/* 固定的触发元素使用children代替，来实现自定义上传元素和拖动上传 */}
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
          ref={fileInput} // 创建ref，使组件能够拿到input节点
          onChange={handleFileChange} // 在onChange生命周期来选择文件
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
