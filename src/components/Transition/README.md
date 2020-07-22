<!--
 * @Author: your name
 * @Date: 2020-06-23 15:31:51
 * @LastEditTime: 2020-06-23 16:27:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tx_antd\src\components\Transition\README.md
-->

# 动画效果

展示时：display: none => display: block; opacity: 0 => 添加动画效果 => display: block; opacity: 1
隐藏时：display: block; opacity: 1 => 添加动画效果 => display: block; opacity: 0 => display: none

# 使用 React 实现动画

React transition group 组件库
实现方式: 没有实现动画效果 而是在类中添加了生命周期类 来区分进入和离开的阶段

# 过程

当 false => true 时：
_-enter(添加类名) = forces a refolw 添加动画效果 > _-enter-active(添加类名) = 自定义 timeout > \*-enter-done(添加类名)

当 true => false 时：
_-exit(添加类名) = forces a refolw 添加动画效果 > _-exit-active(添加类名) = 自定义 timeout > \*-exit-done(添加类名)

使用 React transition group 的 unmountOnExit 属性，使组件属性 in 为 true 时，动态添加节点，in 为 false 时，动态删除节点，不用依赖
其他类

# 写法

<CSSTransition in={open}
    timeout={300}
    classNames="my-node"
    appear
    unmountOnExit>
{node}
</CSSTransition>

通过自己封装，更改为：

<Transition
    in={open}
    timeout={300}
    // 字符串自变量 传递动画效果 如果传入classname会覆盖掉animation
    animation="zoom-in-top"
> </Transition>
