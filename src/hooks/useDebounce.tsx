import { useState, useEffect } from 'react'

/** 自定义实现防抖的hooks */
export default function useDebounce(value: any, delay: number = 300) {
    const [debounceValue, setDebounceValue] = useState(value);
    useEffect(() => {   
        // 创建定时器
        const handler = window.setTimeout(() => {
            setDebounceValue(value);
        }, delay);
        // 下次执行，清除上次设置的定时器
        return () => {
            clearTimeout(handler);
        }
    }, [value, delay]);
    return debounceValue;
}