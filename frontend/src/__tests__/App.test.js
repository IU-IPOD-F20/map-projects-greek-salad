import React from "react";
import { MemoryRouter } from "react-router";
import App from "../App";
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';

configure({adapter: new Adapter()});

test("initial render app", () => {
  const wrapper = shallow(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );
  expect(wrapper).toMatchSnapshot();
});
