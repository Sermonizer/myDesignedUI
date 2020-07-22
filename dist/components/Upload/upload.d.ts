import { FC } from "react";
export declare type UploadFileStatus = "ready" | "uploading" | "success" | "error";
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
    data?: {
        [key: string]: any;
    };
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
export declare const Upload: FC<UploadProps>;
export default Upload;
