import React, { useState } from "react";

import Helpers from "../styles/Helpers";
import useIPC from "../hooks/useIPC";
import { channels } from "../shared/channels";
import Accordion from "../Components/Accordion";
import ThemeSettings from "./ThemeSettings";

export default function Settings() {
  const ipc = useIPC();

  const [ settings, setSettings ] =             useState( null );
  const [ pomodoro, setPomodoro ] =             useState( null );
  const [ theme, setTheme ] =                   useState( null );
  const [ trackerOptions, setTrackerOptions ] = useState( null );

  // Garantees that the window does not reload more than it needs to
  ipc.useDeepEqualEffect(
    () => {
      let currentSettings = ipc.sync( channels.GET_SETTINGS );
      setSettings( currentSettings );
      setTheme( currentSettings.theme );
    },
    [ settings ]
  );

  // Retunrs null in the first render so that the useDeepEqualEffect can
  // get the data from the main process
  if ( settings === null ) {
    return <div></div>;
  } else {
    return (
      <Helpers.Flex
        width="calc( 100% - 57px )"
        margin="0px auto"
        column
      >

        <Accordion
          title="Theme & Styles"
          summary="Change app colors"
          maxHeight="590px"
        >
          <ThemeSettings theme={ theme } setTheme={ setTheme }/>            
        </Accordion>

        <Accordion
          title="Pomodoro Settings"
          summary="Set work and rest time and other pomdoro related settings"
        >

        </Accordion>

        <Accordion
          title="Tracker Options"
          summary="Change alarm, notifications and tracker options"
        >

        </Accordion>
      </Helpers.Flex>
    )
  }
}
