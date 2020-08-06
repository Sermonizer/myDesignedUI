import { ReactElement, InputHTMLAttributes, FC, ChangeEvent } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
declare type InputSize = "lg" | "sm";
export interface InputProps extends Omit<InputHTMLAttributes<HTMLElement>, "size"> {
    /** 是否禁用 */
    disabled?: boolean;
    /** input大小 */
    size?: InputSize;
    /** 是否有icon 有什么样的 */
    icon?: IconProp;
    /** 是否有后缀 */
    prepend?: string | ReactElement;
    /** 是否有前缀 */
    append?: string | ReactElement;
    /** 受控组件 需要用onChange来绑定对应的事件 */
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
/**
 * ### 引入方式
 * ~~~js
 * import { Input } from "tx-design"
 * ~~~
 */
export declare const Input: FC<InputProps>;
export default Input;
