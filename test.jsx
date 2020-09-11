/*
 * @Author: your name
 * @Date: 2020-08-29 22:12:02
 * @LastEditTime: 2020-08-30 16:46:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tx-design\test.jsx
 */
import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [data, setData] = useState({ hist: [] });
  const [query, setQuery] = useState("redux");
  const handleChange = (e) => {
    setQuery(e.target.value);
  };
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        "http://hn.algolia.com/api/v1/search?query=redux"
      );
      setData(result.data);
    };
    fetchData();
  }, [query]);
  return (
    <Fragment>
      <input type="text" value={query} onChange={handleChange} />
      <ul>
        {data.hist.map((item) => (
          <li key={item.objectID}>
            <a href={item.url}>{item.title}</a>
          </li>
        ))}
      </ul>
    </Fragment>
  );
};

export default App;
