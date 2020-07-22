import React from "react";
import { CSSTransition } from "react-transition-group";
import { CSSTransitionProps } from "react-transition-group/CSSTransition";

type AnimationName =
  | "zoom-in-top"
  | "zoom-in-bottom"
  | "zoom-in-left"
  | "zoom-in-right";

// 下面代码error： An interface can only extend an object type or intersection of object types with statically known members.
//                接口只能扩展对象类型或具有静态已知成员的对象类型的交集
// interface TransitionProps extends CSSTransitionProps {
//   animation?: AnimationName;
// }

// 不能用接口 要用类型别名
/** 原因：
 * A class can implement an interface or type alias, both in the same exact way.
 * Note however that a class and interface are considered static blueprints.
 * Therefore, they can not implement / extend a type alias that names a union type.
 */
type TransitionProps = CSSTransitionProps & {
  animation?: AnimationName;
  // button动画冲突解决方案：transition添加属性
  // button已经添加了transition属性 因此在button外层添加一个空节点 使内部的节点都拥有同一个transition
  wrapper?: boolean;
};

const Transition: React.FC<TransitionProps> = (props) => {
  const { children, classNames, animation, wrapper, ...restProps } = props;
  return (
    <CSSTransition
      classNames={classNames ? classNames : animation}
      {...restProps}
    >
      {/* 给button外层套一层div节点 覆盖原有transition */}
      {wrapper ? <div>{children}</div> : children}
    </CSSTransition>
  );
};

Transition.defaultProps = {
  unmountOnExit: true,
  appear: true,
};

export default Transition;
