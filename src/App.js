import Home from "./windows/Home"
import theme from "./theme"
import Helpers from "./styles/Helpers"
import GlobalStyles from "./styles/GlobalStyles"
import { ThemeProvider } from "@material-ui/core"
import { ThemeProvider as StyleTheme } from "styled-components"

function App() {
  return (
    <Helpers.CenterFlex>
      <ThemeProvider theme={ theme }>
        <StyleTheme theme={ theme }>
          <GlobalStyles />
          <header className="App-header">
            やはろお
            <Home />
          </header>
        </StyleTheme>
      </ThemeProvider>
    </Helpers.CenterFlex>
  );
}

export default App;
