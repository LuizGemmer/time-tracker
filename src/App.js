import React, { useState } from "react"
import Home from "./windows/Home"

import useTheme from "./theme"
import useIPC from "./hooks/useIPC"
import Helpers from "./styles/Helpers"
import GlobalStyles from "./styles/GlobalStyles"
import AppDrawer from "./Components/AppDrawer";
import Settings from "./windows/Settings"

import HomeIcon from "@material-ui/icons/Home";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import SettingsIcon from "@material-ui/icons/Settings";
import MenuBookIcon from "@material-ui/icons/MenuBook";

import { createTheme, ThemeProvider } from "@material-ui/core"
import { ThemeProvider as StyleTheme } from "styled-components"

function App() {
  const [ tab, setTab ] = useState( 0 );
  const [ open, setOpen ] = useState( false );
  const tmp = useTheme();
  const [ theme, setTheme ] = useState( createTheme( tmp ) );

  const ipc = useIPC();
  ipc.useDeepEqualEffect(
    () => {
      setTheme( createTheme( tmp ) );
    },
    [tmp]
  )

  const tabs = [
    { label: "Home", component: <Home />, icon: <HomeIcon /> },
    { label: "Projects", component: <Home />, icon: <AccountTreeIcon /> },
    { label: "Settings", component: <Settings />, icon: <SettingsIcon /> },
    { label: "About", component: <Home />, icon: <MenuBookIcon /> },
  ];

  const shouldOpenDrawer = (e) => {
    if ( e.screenX < 150 ) {
      setOpen(true);
    } else if ( open ) {
      setOpen(false);
    }
  }

  return (
    <React.Fragment>
      <ThemeProvider theme={ theme }>
        <AppDrawer 
          drawerItems={ tabs }
          tab={ tab }
          changeTab={ ( newTab ) => setTab( newTab ) }
          open={ open }
        />
        <Helpers.Flex
          column
          onMouseMove={ shouldOpenDrawer } 
          height="calc( 100% - 48px )"
          width="calc( 100% )"   
        >
          
            <StyleTheme theme={ theme }>
              
              <GlobalStyles />

              { tabs[ tab ].component }
            </StyleTheme>

        </Helpers.Flex>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
