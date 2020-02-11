// Libs
import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
// Module
import Header from "@/components/@shared/Header";

describe("Component Header", () => {
  it('should render correctly in "debug" mode', () => {
    const component = shallow(<Header />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
