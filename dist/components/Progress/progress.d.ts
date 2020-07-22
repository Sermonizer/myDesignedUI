import React, { FC } from "react";
import { ThemeProps } from "../Icon/icon";
export interface ProgressProps {
    /** 进度条的百分比 */
    percent: number;
    /** 进度条的高度 */
    strokeHeight?: number;
    /** 是否显示文字 */
    showText?: boolean;
    /** 进度条的样式 */
    styles?: React.CSSProperties;
    /** 进度条的主题 */
    theme?: ThemeProps;
}
/**
 * ### 引入方式
 * ~~~js
 * import { Progress } from "tx-design"
 * ~~~
 */
export declare const Progress: FC<ProgressProps>;
export default Progress;
