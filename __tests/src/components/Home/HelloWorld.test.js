// Libs
import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
// Module
import HelloWorld from "@/components/Home/HelloWorld";

describe("Component HelloWorld", () => {
  it('should render correctly in "debug" mode', () => {
    const component = shallow(<HelloWorld />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
