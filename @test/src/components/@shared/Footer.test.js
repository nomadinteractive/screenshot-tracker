// Libs
import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
// Module
import Footer from "@/components/@shared/Footer";

describe("Component Footer", () => {
  it('should render correctly in "debug" mode', () => {
    const component = shallow(<Footer />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
