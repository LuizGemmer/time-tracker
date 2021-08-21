import Navbar from "../Components/Navbar";
import styled from "styled-components";
import { Drawer } from "@material-ui/core";

const styledDrawer = styled( Drawer )`
  width: ${ props => props.width || "200px" };
  z-index: 99;
  height: 100%;
  display: inline;
`;

const NavStyles = {
  styledDrawer
}

export default NavStyles