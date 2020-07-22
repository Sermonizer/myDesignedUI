<!--
 * @Author: your name
 * @Date: 2020-05-28 21:27:58
 * @LastEditTime: 2020-06-11 17:26:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \sermonizer\src\components\buttons\README.md
--> 


# Button组件
## 需求分析：
### 不同的Button样式
    Primary、Default、Danger、Link
### 不同的Button大小
    Normal、Small、Large
### 不同的Button状态
    Disabled LinkButton
    （链接<a>没有html的disable属性，因此其状态改变要单独对待）
## 其他问题
    组件是否支持Button的原生属性？
## 使用方法
    <Button
        size="lg"
        type="primary"
        disabled
        <!-- 原生属性 -->
        href=""?
        className=""?
        autoFocus=""?
        ...
    >
        children元素
    </Button>