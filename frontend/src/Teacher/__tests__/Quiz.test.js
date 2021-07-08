import React from "react";
import { MemoryRouter } from "react-router";
import Quiz from "../Quiz";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";

configure({ adapter: new Adapter() });

test("quiz initial render app", () => {
  const wrapper = shallow(
    <MemoryRouter initialEntries={["/quiz/343"]}>
      <Quiz />
    </MemoryRouter>
  );
  expect(wrapper).toMatchSnapshot();
});
