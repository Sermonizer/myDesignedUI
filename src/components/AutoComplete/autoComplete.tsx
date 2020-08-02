import React, {
  FC,
  useState,
  ChangeEvent,
  ReactElement,
  useEffect,
  KeyboardEvent,
  useRef,
} from "react";
import classNames from "classnames";
import useDebounce from "../../hooks/useDebounce";
import useClickOutside from "../../hooks/useClickOutside";
import Input, { InputProps } from "../Input/input";
import Transition from "../Transition/transition";
import Icon from "../Icon/icon";

import { library } from "@fortawesome/fontawesome-svg-core";
// 引入全部图标
import { fas } from "@fortawesome/free-solid-svg-icons";
library.add(fas);

/*
  因为数据不一定是string数组的形式，所以需要更复杂的类型来实现
  采用了一种包含value：string的数据结构
  泛型约束: 这个对象必须包含value作为key
*/
interface DataSourceObject {
  // 用value代替原来的data
  value: string;
}

// 使用泛型<T 默认值是{空对象}>定义数据的类型, 在使用的时候再定义它的类型 返回一个交叉类型（T + DataSourceObject）
export type DataSourceType<T = {}> = T & DataSourceObject;

export interface AutoCompleteProps extends Omit<InputProps, "onSelect"> {
  /** 用户自定义实现筛选数据的方法（并且实现异步请求）*/
  fetchSuggestions: (
    str: string
    // 自定义请求的返回可能是异步的，返回一个Promise
  ) => DataSourceType[] | Promise<DataSourceType[]>;
  /** 告诉用户选择了哪个值 */
  onSelect?: (item: DataSourceType) => void;
  /** 用户自定义下拉菜单的样式 */
  renderOption?: (item: DataSourceType) => ReactElement;
}

/**
 * ### 引入方式
 * ~~~js
 * import { AutoComplete } from "tx-design"
 * ~~~
 */
export const AutoComplete: FC<AutoCompleteProps> = (props) => {
  const {
    fetchSuggestions,
    onSelect,
    renderOption,
    // inputValue的初始值
    value,
    ...restProps
  } = props;

  // 定义输入的值
  const [inputValue, setInputValue] = useState(value as string);
  // 操作下拉菜单里的数据
  const [Suggestions, setSuggestions] = useState<DataSourceType[]>([]);
  // 当fetch请求数据时 增加一个icon样式 显示正在请求
  const [loading, setLoading] = useState(false);
  // 展示下拉菜单
  const [showDropdown, setShowDropdown] = useState(false);
  // 异步 自定义hook
  const debouncedValue = useDebounce(inputValue, 500);
  // 下拉菜单高亮
  const [highlightIndex, setHighlightIndex] = useState(-1);
  // 希望在选中数据后 不会再进行一次搜索
  const triggerSearch = useRef(false);
  // 指向组件的Dom节点 传入泛型 因为最外层是div
  const componentRef = useRef<HTMLDivElement>(null);

  // 点击窗口其他位置 使下拉框关闭
  useClickOutside(componentRef, () => {
    setSuggestions([]);
  });

  // 多次输入时 需要做防抖
  useEffect(() => {
    // 当value改变且trigger为true时才触发搜索的逻辑
    if (debouncedValue && triggerSearch.current) {
      setSuggestions([]);
      const results = fetchSuggestions(debouncedValue);
      // 异步的实现
      if (results instanceof Promise) {
        // console.log("trigger");
        setLoading(true);
        results.then((data) => {
          setLoading(false);
          setSuggestions(data);
          if (data.length > 0) {
            setShowDropdown(true);
          }
        });
      } else {
        setSuggestions(results);
        setShowDropdown(true);
        if (results.length > 0) {
          setShowDropdown(true);
        }
      }
    } else {
      setShowDropdown(false);
    }
    setHighlightIndex(-1);
  }, [debouncedValue, fetchSuggestions]);

  // 设置下拉菜单中高亮的项
  const highlight = (index: number) => {
    // 设置高亮的范围 不能一直往上\下按
    if (index < 0) index = 0;
    if (index >= Suggestions.length) {
      index = Suggestions.length - 1;
    }
    setHighlightIndex(index);
  };

  // 处理input输入框的改变
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setInputValue(value);
    // 当handleChange时希望trigger的值变为true
    triggerSearch.current = true;
  };

  // 将点击的下拉菜单中的值填充到input中，并且隐藏下拉菜单
  const handleSelect = (item: DataSourceType) => {
    // item是Object,因此要取它的value
    setInputValue(item.value);
    setShowDropdown(false);
    if (onSelect) {
      onSelect(item);
    }
    // 当handleSelect时希望trigger的值变为false 不去触发搜索
    triggerSearch.current = false;
  };

  // 处理键盘事件
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.keyCode) {
      // 回车
      case 13:
        if (Suggestions[highlightIndex]) {
          handleSelect(Suggestions[highlightIndex]);
        }
        break;
      // 向上
      case 38:
        highlight(highlightIndex - 1);
        break;
      // 向下
      case 40:
        highlight(highlightIndex + 1);
        break;
      // esc
      case 27:
        setShowDropdown(false);
        break;
      default:
        break;
    }
  };

  // 判断用户是否自定义模板样式
  const renderTemplate = (item: DataSourceType) => {
    return renderOption ? renderOption(item) : item.value;
  };

  // 显示下拉数据
  const generateDropdown = () => {
    return (
      <Transition
        in={showDropdown || loading}
        animation="zoom-in-top"
        timeout={300}
        onExited={() => {
          setSuggestions([]);
        }}
      >
        <ul className="suggestion-list">
          {loading && (
            <div className="suggstions-loading-icon">
              <Icon icon="spinner" spin />
            </div>
          )}
          {Suggestions.map((item, index) => {
            const cnames = classNames("suggestion-item", {
              "is-active": index === highlightIndex,
            });
            return (
              <li
                key={index}
                className={cnames}
                onClick={() => handleSelect(item)}
              >
                {renderTemplate(item)}
              </li>
            );
          })}
        </ul>
      </Transition>
    );
  };
  //   return (
  //     <ul>
  //       {Suggestions.map((item, index) => {
  //         const cnames = classNames("suggestion-item", {
  //           "item-highlighted": index === highlightIndex,
  //         });
  //         return (
  //           <li
  //             key={index}
  //             className={cnames}
  //             onClick={() => handleSelect(item)}
  //           >
  //             {renderTemplate(item)}
  //           </li>
  //         );
  //       })}
  //     </ul>
  //   );
  // };

  return (
    <div className="auto-complete" ref={componentRef}>
      <Input
        value={inputValue}
        onChange={handleChange}
        // 添加键盘事件 能够上下键 enter esc
        onKeyDown={handleKeyDown}
        {...restProps}
      />
      {generateDropdown()}
    </div>
  );
};

export default AutoComplete;
