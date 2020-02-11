// Libs
import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
// Module
import Path from "@/components/Home/Path";

describe("Component Path", () => {
  it('should render correctly in "debug" mode', () => {
    const component = shallow(<Path />);
    expect(toJson(component)).toMatchSnapshot();

  });
});
