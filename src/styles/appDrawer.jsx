import styled from "styled-components"

import { Button } from "@material-ui/core"

export const Wrapper = styled("div")`
  display:    flex;
  position:   fixed;
  height:     ${ props => (props.drawerWidth * 4 + "px") };
  top:        50%;
  left:       ${props => (
    props.open ? 0 : -(props.drawerWidth + 16) + "px"
  )};
  zIndex:     100;
  transform:  translateY(-50%);
  margin:     0 16px;

  transition: left 0.2s
`;

export const DrawerButton = styled( Button ) `
  min-width:    ${ props => props.drawerwidth } !important; 
  padding:      16px 0px !important;
  max-height:   ${ props => props.drawerwidth };
`;

export const Circle = styled.div`
  position:       relative;
  top:            50%;
  left:           50%;
  transform:      translateY(-50%);
  border-radius:  50%;
  width:          57px;
  height:         57px;
  background:     ${ props => props.theme.palette.background.paper };
  z-index:        99;

  display:        flex;
  justify-content:center;
  align-items:    center
`;

export const Drawer = styled.div`
  position:   fixed; 
  width:      ${ props => props.drawerwidth}; 
  background: ${ props => props.theme.palette.background.paper };
  z-index:    100
`;