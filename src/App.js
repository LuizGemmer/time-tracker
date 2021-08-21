import React, { useState } from "react"
import Home from "./windows/Home"

import theme from "./theme"
import Helpers from "./styles/Helpers"
import GlobalStyles from "./styles/GlobalStyles"
import AppDrawer from "./Components/Navbar";

import HomeIcon from "@material-ui/icons/Home";

import { ThemeProvider } from "@material-ui/core"
import { ThemeProvider as StyleTheme } from "styled-components"

function App() {
  const [tab, setTab] = useState( 0 );

  const tabs = [
    { label: "Home", component: <Home />, icon: <HomeIcon /> },
  ]

  return (
    <React.Fragment>
      <ThemeProvider theme={ theme }>
        <AppDrawer 
          drawerItems={ tabs }
          tab={ tab }
          changeTab={ ( newTab ) => setTab( newTab ) }
        />
        <Helpers.CenterFlex column height="calc( 100% - 48px )" >
          
            <StyleTheme theme={ theme }>
              
              <GlobalStyles />

              { tabs[ tab ].component }
            </StyleTheme>

        </Helpers.CenterFlex>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
