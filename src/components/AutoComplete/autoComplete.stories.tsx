import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import AutoComplete, { DataSourceType } from "./autoComplete";

interface GIthubUserProps {
  login: string;
  url: string;
  avatar_url: string;
}

// 默认组件
const defaultAutoComplete = () => {
  const data = ['test1', 'test2', 'test3', 'cook', 'pope', 'AD', 'green', 'width'];
  const handleFetch = (val: string): DataSourceType[] => {
      const filterData = data.filter(item => item.includes(val));
      return filterData.map(item => ({ value: item }));
  };
  return (
      <AutoComplete placeholder="default autocomplete" fetchSuggestions={handleFetch} onSelect={action('change select to value')} />
  );
};

// 异步组件
const asyncAutoComplete = () => {
  //   const lakersWithNumber = [
  //     { value: "kobe", number: 24 },
  //     { value: "gemes", number: 23 },
  //     { value: "lining", number: 1 },
  //     { value: "wusong", number: 2 },
  //     { value: "green", number: 66 },
  //     { value: "howard", number: 13 },
  //     { value: "kuzma", number: 36 },
  //     { value: "rando", number: 27 },
  //   ];

  //   const handleFetch = (query: string) => {
  //     return Lakers.filter((name) => name.includes(query));
  //   };
  //   const handleFetch = (query: string) => {
  //     return lakersWithNumber.filter((player) => player.value.includes(query));
  //   };

  // 使用fetch实现请求
  const handleFetch = (query: string) => {
    return fetch(`https://api.github.com/search/users?q=${query}`)
      .then((res) => res.json())
      .then(({ items }) => {
        console.log(items);
        return items
          .slice(0, 10)
          .map((item: any) => ({ value: item.login, ...item }));
      });
  };

  // 用户自定义下拉菜单样式
  // const renderOption = (item: DataSourceType<GIthubUserProps>) => {
  //   return (
  //     <>
  //       <h2>Name: {item.login}</h2>
  //       <p>url: {item.url}</p>
  //     </>
  //   );
  // };

  return (
    <AutoComplete
      placeholder="请求Github的API"
      style={{ width: "300px" }}
      fetchSuggestions={handleFetch}
      // onSelect={action("selected")}
      // renderOption={renderOption}
    />
  );
};

storiesOf("AutoComplete Component", module)
  .add("AutoComplete", defaultAutoComplete)
  .add("异步渲染的AutoComplete", asyncAutoComplete);
