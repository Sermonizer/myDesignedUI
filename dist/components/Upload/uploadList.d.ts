import { FC } from "react";
import { UploadFile } from "./upload";
/**
 *  展示上传文件状态UI的组件
 */
interface UploadListProps {
    fileList: UploadFile[];
    onRemove: (_file: UploadFile) => void;
}
export declare const UploadList: FC<UploadListProps>;
export default UploadList;
