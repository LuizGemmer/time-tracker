import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
	* {
		color: ${ props => props.theme.palette.text.primary };
		box-sizing: border-box;
	}

	body {
		background: ${ props => props.theme.palette.background.default };
		height: 100vh;
		overflow: hidden
	}

	#root {
		height: 100%;
	}
`;

export default GlobalStyles;