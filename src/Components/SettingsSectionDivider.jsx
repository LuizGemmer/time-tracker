import React from "react"

import Helpers from "../styles/Helpers";

import { Divider } from "@material-ui/core";

export default function SettingsSectionDivider( props ) {
  return (
    <React.Fragment>
      <Helpers.Font 
        tone="secondary" 
        margin={ props.first ? "0 auto 0 0" : "1.5rem auto 0 0" } 
        size="15px"
      >
          { props.label }
      </Helpers.Font>
      <Divider style={{ width: "100%", margin: ".7rem 0" }}/>
    </React.Fragment>
  )
}
