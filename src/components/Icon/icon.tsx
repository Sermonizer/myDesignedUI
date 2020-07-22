import React from "react";
import classNames from "classnames";
// 导入icon图标
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";

// 希望icon根据theme变化颜色 进行一次封装
export type ThemeProps =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "light"
  | "dark";

export interface IconProps extends FontAwesomeIconProps {
  theme?: ThemeProps;
}

const Icon: React.FC<IconProps> = (props) => {
  // icon-primary
  const { theme, className, ...restProps } = props;
  // 当传递theme时 定义一个icon-theme的类
  const cnames = classNames("icon", className, {
    [`icon-${theme}`]: theme,
  });

  return <FontAwesomeIcon className={cnames} {...restProps} />;
};

export default Icon;
