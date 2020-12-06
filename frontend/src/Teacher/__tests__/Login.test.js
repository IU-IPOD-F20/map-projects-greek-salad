import React from "react";
import { MemoryRouter } from "react-router";
import Login from "../Login";
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';

configure({adapter: new Adapter()});

test("login initial render app", () => {
  const wrapper = shallow(
    <MemoryRouter initialEntries={["/login"]}>
      <Login />
    </MemoryRouter>
  );
  expect(wrapper).toMatchSnapshot();
});
