import React from "react";
import { MemoryRouter } from "react-router";
import Student from "../index";
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';

configure({adapter: new Adapter()});

test("student initial render app", () => {
  const wrapper = shallow(
    <MemoryRouter initialEntries={["/student"]}>
      <Student />
    </MemoryRouter>
  );
  expect(wrapper).toMatchSnapshot();
});