import styled from "styled-components";
import Helpers from "./Helpers";

import { ButtonBase } from "@material-ui/core"

export const AccordionBody = styled( Helpers.Flex )`
  max-height: ${props => props.open ? ( props.maxHeight || "600px" ) : "50px"};
  background: ${ props => props.theme.palette.background.paper };
  border-radius: ${ props => props.open && "5px" };
  margin: ${ props => props.open ? "1rem 0" : "0px" };
  overflow: hidden;
  
  transition: max-height 1s ease-in, 
              border-radius 0.25s linear,
              margin 0.25s linear
`;

export const AccordionHeader = styled( ButtonBase )`
  width: 100%;
  min-height: 50px;
  max-height: 50px;
`;

export const AccordionContent = styled( Helpers.Flex )`
  padding: 1rem
`;