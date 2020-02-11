// Libs
import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";

// Module
import LayoutApp from "@/layouts/App";

describe("Layout LayoutApp", () => {
  it('should render correctly in "debug" mode', () => {
    const component = shallow(
      <LayoutApp>
        <div>children</div>
      </LayoutApp>
    );
    expect(toJson(component)).toMatchSnapshot();
  });
});
