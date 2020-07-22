import React, { FC, CSSProperties, createContext } from "react";
import classNames from "classnames";
import { useState } from "@storybook/addons";
import {MenuItemProps} from './menuItem';

type MenuMode = "horizontal" | "vertical";

type SelectCallback = (selectedIndex: string) => void;

export interface MenuProps {
  defaultIndex?: string;
  mode?: MenuMode;
  className?: string;
  style?: CSSProperties;
  onSelect?: SelectCallback;
}

interface IMenuContext {
  index: string;
  mode?: MenuMode;
  onSelect?: SelectCallback;
}

export const MenuContext = createContext<IMenuContext>({
  index: "0",
});

const Menu: FC<MenuProps> = (props) => {
  const { defaultIndex, mode, className, style, onSelect, children } = props;

  const [currentActive, setActive] = useState(defaultIndex);

  const handleCLick = (index: string) => {
    setActive(index);
    if (onSelect) {
      onSelect(index);
    }
  };

  const passedContext: IMenuContext = {
    index: currentActive ? currentActive : "0",
    onSelect: handleCLick,
  };

  const classes = classNames("menu", className, {
    "menu-vertical": mode === "vertical",
    "menu-horizontal": mode !== "vertical",
  });

  const renderChildren = () => {
    return React.Children.map(children, (child, index) => {
      const childElement = child as React.FunctionComponentElement<MenuItemProps>
      const { displayName } = childElement.type
      if (displayName === "MenuItem") {
        return React.cloneElement(childElement, {
          index: index.toString()
        })
      } else {
        console.error("not a MenuItem Element");
      }
    })
  }
  return (
    <ul className={classes} style={style}>
      <MenuContext.Provider value={passedContext}>
        {renderChildren()}
      </MenuContext.Provider>
    </ul>
  );
};

Menu.defaultProps = {
  defaultIndex: "0",
  mode: "horizontal",
};

export default Menu;
