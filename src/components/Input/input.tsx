import React, {
  ReactElement,
  InputHTMLAttributes,
  FC,
  ChangeEvent,
} from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import classNames from "classnames";
import Icon from "../Icon/icon";

type InputSize = "lg" | "sm";
// omit 忽略原有的属性
export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLElement>, "size"> {
  /**是否禁用 */
  disabled?: boolean;
  /**input大小 */
  size?: InputSize;
  /**是否有icon 有什么样的 */
  icon?: IconProp;
  /**是否有后缀 */
  prepend?: string | ReactElement;
  /**是否有前缀 */
  append?: string | ReactElement;
  /**受控组件 需要用onChange来绑定对应的事件*/
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * ### 引入方式
 * ~~~js
 * import { Input } from "tx-design"
 * ~~~
 */
export const Input: FC<InputProps> = (props) => {
  // 取出需要的属性
  const { disabled, size, icon, prepend, append, style, ...restProps } = props;
  // 根据属性计算不同的classname
  const classes = classNames("input-wrapper", {
    [`input-size-${size}`]: size,
    "is-disabled": disabled,
    "input-group": prepend || append,
    // !! 强制转换为boolean类型
    "input-group-append": !!append,
    "input-group-prepend": !!prepend,
  });

  // 希望受控组件不会变成非受控组件
  const fixControlledValue = (value: any) => {
    if (typeof value === "undefined" || value === null) {
      // 为value设置初始值
      return "";
    }
    return value;
  };

  /**
   * 非受控组件使用defaultValue来表示组件的默认状态
   * 只能有一个value 有了value defaultvalue就不能存在了
   */
  if ("value" in props) {
    delete restProps.defaultValue;
    restProps.value = fixControlledValue(props.value);
  }

  return (
    // 根据属性判断是否添加特定的节点
    <div className={classes} style={style}>
      {prepend && <div className="input-group-prepend">{prepend}</div>}
      {icon && (
        <div className="icon-wrapper">
          <Icon icon={icon} title={`title-${icon}`} />
        </div>
      )}
      <input className="input-inner" disabled={disabled} {...restProps} />
      {append && <div className="input-group-append">{append}</div>}
    </div>
  );
};

export default Input;
