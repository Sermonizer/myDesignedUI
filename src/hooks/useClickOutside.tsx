import { RefObject, useEffect } from "react";

/** 当鼠标点击元素之外的地方触发的hooks */
export default function useClickOutside(ref: RefObject<HTMLElement>, handler: Function) {
    useEffect(() => {
        const listener = (event: MouseEvent) => {
            // 判断鼠标点击的是不是ref指向那个元素中
            if (!ref.current || ref.current.contains(event.target as HTMLElement)) {
                return;
            }
            // 不是当前元素，关闭下拉菜单
            handler(event);
        }
        document.addEventListener('click', listener);
        // 删除事件
        return () => {
            document.removeEventListener('click', listener);
        }
    }, [ref, handler]);
}