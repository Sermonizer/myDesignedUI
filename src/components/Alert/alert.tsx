import React, {
  useCallback,
  useRef,
  useState,
  ReactNode,
  FC,
  HTMLAttributes,
} from "react";
import classNames from "classnames";
import Icon from "../Icon/icon";
import Transition from "../Transition/transition";

type AlertType = "success" | "default" | "danger" | "warning";

interface BaseAlertProps {
  /** alert的类型，背景色 */
  type?: AlertType;
  /** 是否有关闭 x */
  hasClose?: boolean;
  /** Alert组件的标题 */
  title: string | ReactNode;
  /** 关闭Alert组件回调方法 */
  onClose?: (currentEvent: HTMLDivElement) => any;
}
export type AlertProps = BaseAlertProps & HTMLAttributes<HTMLElement>;
/**
 * ### 引用方式
 * ~~~js
 * import { Alert } from 'tx-design';
 * ~~~
 */
export const Alert: FC<AlertProps> = ({
  type,
  hasClose,
  className,
  title,
  children,
  onClose,
  ...restProps
}) => {
  const classes = classNames("alert", className, {
    [`alert-${type}`]: type,
  });
  const [show, setShow] = useState<boolean>(true);
  // useRef 返回一个可变的 ref 对象，其 .current 属性被初始化为传入的参数
  const alertRef = useRef<HTMLDivElement>();
  // 自己干掉自己，也可以让用户自定义操作
  const close = useCallback(() => {
    if (onClose) {
      // 对alertRef.current这个属性进行非空断言
      onClose(alertRef.current!);
    }
    // 直接隐藏了
    // alertRef.current?.parentElement?.removeChild(alertRef.current);
    setShow(false);
  }, [onClose]);
  return (
    // in: 控制组件应用动画的属性值，通常将react组件的state赋予它，通过改变state来开启和关闭动画
    <Transition timeout={300} in={show} animation="zoom-in-left">
      <div
        className={classes}
        ref={alertRef as any}
        {...restProps}
        data-testid="test-alert"
      >
        {children ? <h3>{title}</h3> : <span>{title}</span>}
        {children && <span>{children}</span>}
        {hasClose && (
          <span className="close" onClick={close} data-testid="test-alert-icon">
            <Icon icon="times" />
          </span>
        )}
      </div>
    </Transition>
  );
};
Alert.defaultProps = {
  type: "default",
  hasClose: true,
};
export default Alert;
