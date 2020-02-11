// Libs
import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";

// Module
import Root from "@/routes/Root";

describe("Routes", () => {
  it('should render correctly in "debug" mode', () => {
    const component = shallow(<Root />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
