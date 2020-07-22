import React, { FC, ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
export declare type ButtonType = "primary" | "danger" | "default" | "link";
export declare type ButtonSize = "lg" | "sm";
interface BaseButtonProps {
    className?: string;
    btnType?: ButtonType;
    size?: ButtonSize;
    disabled?: boolean;
    children?: React.ReactNode;
    href?: string;
}
declare type NativeButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLElement>;
declare type AnchorButtonProps = BaseButtonProps & AnchorHTMLAttributes<HTMLElement>;
export declare type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>;
export declare const Button: FC<ButtonProps>;
export default Button;
