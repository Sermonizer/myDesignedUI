import React from "react";
import { render } from "@testing-library/react";
import Button from "./button";

test("button", () => {
  const wrapper = render(<Button>Good</Button>);
  const child = wrapper.queryByText("Good");
  expect(child).toBeTruthy();
});
