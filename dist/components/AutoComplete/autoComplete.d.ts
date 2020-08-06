import { FC, ReactElement } from "react";
import { InputProps } from "../Input/input";
interface DataSourceObject {
    value: string;
}
export declare type DataSourceType<T = {}> = T & DataSourceObject;
export interface AutoCompleteProps extends Omit<InputProps, "onSelect"> {
    /** 用户自定义实现筛选数据的方法（并且实现异步请求）*/
    fetchSuggestions: (str: string) => DataSourceType[] | Promise<DataSourceType[]>;
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
export declare const AutoComplete: FC<AutoCompleteProps>;
export default AutoComplete;
