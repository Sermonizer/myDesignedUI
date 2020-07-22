import React, { FC } from "react";
import { UploadFile } from "./upload";
import Icon from "../Icon/icon";
import Progress from "../Progress/progress";

/**
 *  展示上传文件状态UI的组件
 */

interface UploadListProps {
  fileList: UploadFile[];
  onRemove: (_file: UploadFile) => void;
}

export const UploadList: FC<UploadListProps> = (props) => {
  const { fileList, onRemove } = props;
  return (
    <ul className="upload-list">
      {/* 循环展示fileList */}
      {fileList.map((item) => {
        return (
          // 由于是循环，所以给li增加一个key
          <li className="upload-list-item" key={item.uid}>
            {/* 需要根据不同类型展示不同的颜色, 因此添加filename-status的class */}
            <span className={`file-name file-name-${item.status}`}>
              <Icon icon="file-alt" theme="secondary" />
              {item.name}
            </span>
            <span className="file-status">
              {item.status === "uploading" && (
                <Icon icon="spinner" spin theme="primary" />
              )}
              {item.status === "success" && (
                <Icon icon="check-circle" theme="success" />
              )}
              {item.status === "error" && (
                <Icon icon="times-circle" theme="danger" />
              )}
            </span>
            <span className="file-actions">
              <Icon
                icon="times"
                onClick={() => {
                  onRemove(item);
                }}
              />
            </span>
            {/* 添加进度条 */}
            {item.status === "uploading" && (
              <Progress percent={item.percent || 0} />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default UploadList;
