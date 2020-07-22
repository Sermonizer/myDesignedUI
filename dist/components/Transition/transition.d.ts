import React from "react";
import { CSSTransitionProps } from "react-transition-group/CSSTransition";
declare type AnimationName = "zoom-in-top" | "zoom-in-bottom" | "zoom-in-left" | "zoom-in-right";
/** 原因：
 * A class can implement an interface or type alias, both in the same exact way.
 * Note however that a class and interface are considered static blueprints.
 * Therefore, they can not implement / extend a type alias that names a union type.
 */
declare type TransitionProps = CSSTransitionProps & {
    animation?: AnimationName;
    wrapper?: boolean;
};
declare const Transition: React.FC<TransitionProps>;
export default Transition;
