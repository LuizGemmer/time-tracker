import React from 'react';

import { useTheme } from '@material-ui/core/styles';
import ChevronLeft from "@material-ui/icons/ChevronLeft"
import { Wrapper, DrawerButton, Circle, Drawer } from "../styles/appDrawer"

const drawerWidthNum = 57
const drawerWidth = `${ drawerWidthNum }px`;

export default function AppDrawer( props ) {
  const theme = useTheme();
  const [ hover, setHover ] = React.useState( -1 );

  const styles = {
    span: {
      width: drawerWidth , 
      display:  "inline-flex", 
      alignItems: "center", 
      justifyContent:"center",
    },
  } 

  return (
    <Wrapper
      open=         { props.open }
      drawerWidth=  { drawerWidthNum }
    >
      <Drawer theme={ theme } drawerwidth={ drawerWidth }>
        { props.drawerItems.map( ( item, index ) => (
            <DrawerButton 
              drawerwidth={ drawerWidth }
              style={{ 
                background: props.tab === index ? theme.palette.action.hover : "inherit" 
              }}
              onMouseOver={ () => setHover( index ) }
              onMouseOut={ () => setHover( -1 ) }
              key={ item.label }
            >
              <span style={ styles.span }>
                {item.icon}
              </span>
              { hover === index && (
                <span style={{ padding: "0px 16px" }} >
                  { item.label }
                </span>
              )  }
            </DrawerButton>
            
          ))}
      </Drawer>
      <Circle theme={ theme }>
        <ChevronLeft 
          style={{ 
            transform: `translateX(50%) rotate(${ props.open ? "0deg" : "180deg" })`, 
            transition: "transform 0.2s"
          }}
        />
      </Circle>
    </Wrapper>
  );
}
