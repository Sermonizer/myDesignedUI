import { FC } from "react";
interface DragProps {
    /** 文件拖动完成后触发的事件 */
    onFile: (files: FileList) => void;
}
export declare const Dragger: FC<DragProps>;
export default Dragger;
