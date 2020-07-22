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
export const Progress: FC<ProgressProps> = (props) => {
  const { percent, strokeHeight, showText, styles, theme } = props;
  return (
    <div className="progress-bar" style={styles}>
      {/* 进度条的外层 */}
      <div
        className="progress-bar-outer"
        // 添加动态高度
        style={{ height: `${strokeHeight}px` }}
      >
        <div
          className={`progress-bar-inner color-${theme}`}
          style={{ width: `${percent}%` }}
        >
          {showText && <span className="inner-text">{`${percent}%`}</span>}
        </div>
      </div>
    </div>
  );
};

// 进度条的默认值
Progress.defaultProps = {
  strokeHeight: 15,
  showText: true,
  theme: "primary",
};

export default Progress;
