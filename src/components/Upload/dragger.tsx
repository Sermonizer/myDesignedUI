import React, { FC, useState, DragEvent } from "react";
import classNames from "classnames";

interface DragProps {
  /** 文件拖动完成后触发的事件 */
  onFile: (files: FileList) => void;
}
// 实现拖拽上传文件
export const Dragger: FC<DragProps> = (props) => {
  const { onFile, children } = props;
  /** 拖动完成的状态 */
  const [dragOver, setDragOver] = useState(false);
  const cnames = classNames("uploader-dragger", {
    "is-dragover": dragOver,
  });
  // DragEvent是React的对象，不是原生的，因此可以加入泛型
  const handleDrag = (e: DragEvent<HTMLElement>, over: boolean) => {
    e.preventDefault();
    setDragOver(over);
  };

  const handleDrop = (e: DragEvent<HTMLElement>) => {
      e.preventDefault()
      setDragOver(false)
      onFile(e.dataTransfer.files)
  }

  return (
    <div
      className={cnames}
      onDragOver={(e) => {
        handleDrag(e, true);
      }}
      onDragLeave={(e) => {
        handleDrag(e, false);
      }}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
};

export default Dragger;
