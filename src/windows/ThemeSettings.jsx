import React, { useState, } from 'react';

import Helpers from "../styles/Helpers";
import useIPC from "../hooks/useIPC";
import SettingsSectionDivider from '../Components/SettingsSectionDivider';
import TextInput from "../Components/TextInput";

import { RadioGroup, Radio, FormControlLabel, Button } from "@material-ui/core";
import { channels } from '../shared/channels';

export default function ThemeSettings({ theme, setTheme }) {
  const ipc = useIPC();
  // Theme being customized
  const [ tempTheme, setTempTheme ] = useState( theme.themes[ theme.selected ] );
  // Any error messages
  const [ invalidInput, setInvalidInput ] = useState({
    background: "",
    paper:      "",
    primary:    "",
    secondary:  "" 
  });

  // Prevents the window from updating more than twice
  ipc.useDeepEqualEffect(() => {
    setTempTheme( theme.themes[ theme.selected ] );
  }, [ theme ]);

  const updateTheme = ( property ) => {
    let color = tempTheme.colors[ property ];
    // Adds the # if the color does not have it
    if ( color.length === 6 ) color = "#" + color;
    
    const newInvalidInput = { ...invalidInput };

    // if the color is valid
    if ( isValidColor( color ) ) {
      // Sends it to the main process to make a preview of the theme
      ipc.async( channels.PREVIEW_THEME, tempTheme );
      newInvalidInput[ property ] = "";
    } else {
      // else return an error message to the form
      newInvalidInput[ property ] = "Invalid hexadecimal color: check if the color format is hexadecimal";
    };

    setInvalidInput( newInvalidInput );
  };

  // Check if the color from the user is a valid hex 24 bit color
  const isValidColor = ( color ) => {
    const validHexDigits = [
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
      "a", "b", "c", "d", "e", "f",
      "A", "B", "C", "D", "E", "F",
      "#"
    ];

    if ( color.length === 7 && color[ 0 ] === "#" ) {
      let isValidHex = true;
      for ( let char of color ) {
        if ( !validHexDigits.includes( char ) ) {
          isValidHex = false;
          break;
        };
      };
      return isValidHex;
    };
  };

  // Sends the theme to the main process to be saved
  const saveTheme = () => {
    const newThemes = { ...theme.themes };
    newThemes[ theme.selected ] = tempTheme;

    const newTheme = {
      selected: theme.selected,
      themes: newThemes
    };

    ipc.sync( channels.UPDATE_THEMES, newTheme );
    setTheme( newTheme );
  }
  
  return (
    <React.Fragment>
      <SettingsSectionDivider label="Themes" first/>

      <RadioGroup
        row
        style={{ justifyContent:"space-around" }}
        value={ theme.selected }
        onChange={ e => {
          setTheme({ ...theme, selected: e.target.value });
          // Resets the erros when the theme gets changed
          setInvalidInput({ 
            background: "",
            paper:      "",
            primary:    "",
            secondary:  "" 
          });
        }}
      >
        
        { 
          Object.keys( theme.themes ).map( customTheme => (
           <FormControlLabel 
              key={ customTheme }
              value={ customTheme } 
              control={ <Radio color="primary"/> } 
              label={ theme.themes[ customTheme ].name }
            />
          )) 
        }
      </RadioGroup>

      {/* 
        The dark and light themes are not customizable
        so the customize screen only renders when the other themes
        are selected
      */}
      {
        theme.selected === "dark" || theme.selected === "light" ? (
          null
        ) : (
          <React.Fragment>
            <SettingsSectionDivider label="Customize Current Theme"/>
            <Helpers.Label width="95%" margin="0 auto">
              Theme Name:
              <Helpers.TextInput
                value={ tempTheme && tempTheme.name }
                onChange={ e => setTempTheme( { ...tempTheme, name: e.target.value } ) }
              />
            </Helpers.Label>

            <Helpers.Flex 
              margin="1rem auto 0 auto" 
              width="95%"
              justifyContent="space-between" 
              style={{ flexWrap: "wrap", gap: "0.5rem" }}
            >

              <TextInput 
                label="Background Primary"
                value={ tempTheme.colors.background }
                onChange={ e => setTempTheme( { 
                  ...tempTheme, 
                  colors: { ...tempTheme.colors, background: e.target.value },
                })}
                onBlur={ () => updateTheme( "background" ) }
                errorMessage={ invalidInput.background }
              />    
                   
              <TextInput 
                label="Background Secondary"
                value={ tempTheme.colors.paper }
                onChange={ e => setTempTheme( { 
                  ...tempTheme, 
                  colors: { ...tempTheme.colors, paper: e.target.value },
                })}
                onBlur={ () => updateTheme( "paper" ) }
                errorMessage={ invalidInput.paper }
              />    

              <TextInput 
                label="Work / Primary Color"
                value={ tempTheme.colors.primary }
                onChange={ e => setTempTheme( { 
                  ...tempTheme, 
                  colors: { ...tempTheme.colors, primary: e.target.value },
                })}
                onBlur={ () => updateTheme( "primary" ) }
                errorMessage={ invalidInput.primary }
              /> 

              <TextInput 
                label="Rest / Secondary Color"
                value={ tempTheme.colors.secondary }
                onChange={ e => setTempTheme( { 
                  ...tempTheme, 
                  colors: { ...tempTheme.colors, secondary: e.target.value },
                })}
                onBlur={ () => updateTheme( "secondary" ) }
                errorMessage={ invalidInput.secondary }
              />          

            </Helpers.Flex>

            <Helpers.Flex
              margin="1rem 0 0 auto"
            >
              <Button 
                variant="contained" 
                disabled={false} 
                color="primary" 
                style={{ marginRight: "1rem" }}
                onClick={ () => setTempTheme( theme.themes[ theme.selected ] ) }
              >
                Reset changes
              </Button>
              
              <Button 
                variant="contained" 
                disabled={false} 
                color="primary"
                onClick={ saveTheme }
              >
                Save changes
              </Button>
            </Helpers.Flex>
          </React.Fragment>
        )
      }
    </React.Fragment>
  );
};
