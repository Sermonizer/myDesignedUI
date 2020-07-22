<!--
 * @Author: your name
 * @Date: 2020-06-13 13:27:19
 * @LastEditTime: 2020-06-23 16:40:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tx_antd\src\components\Menu\README.md
--> 

# Menu需求
## 横向
所在menu高亮 且有下划线 
可以disabled
当鼠标指向其他menu 当前menu高亮 先前高亮消失
有下拉菜单 鼠标hover时 显示下拉菜单 鼠标移开时消失

## 纵向
所在menu高亮 且有下划线 
可以disabled
当鼠标指向其他menu 当前menu高亮 先前高亮消失
有下拉菜单 且默认打开 鼠标点击时 打开/关闭下拉菜单

# 语义化的解决方案
<Menu defaultIndex="0" onSelect={} mode="vertical">
    <subMenu title="..." index="0">
        <Item index="0-0">
            title1
        </Item>
        <Item index="0-1">
            title2
        </Item>
    </subMenu>
    <Item disabled index="1">
        disabled link
    </Item>
    <Item index="2">
        <a href="https://www.baidu.com">百度</a>
    </Item>
</Menu>

# 属性分析
## Menu
activeIndex: 高亮的menu
mode: 横向/纵向
onSelect: () => {}
className: string 自定义类别

## MenuItem
index: number 
disabled: boolean
className: string
