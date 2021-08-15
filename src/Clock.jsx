import React, { useState, useEffect } from 'react'

import PlayArrowIcon from "@material-ui/icons/PlayArrowOutlined"
import StopIcon from "@material-ui/icons/StopOutlined"

import ClockStyles from "./styles/Clock"
import { IconButton } from '@material-ui/core';

export default function Clock( props ) {
  const [ degree, setDegree ] = useState( 0 );

  useEffect(() => {
    setDegree( 360 * props.cycleCompletion );
  }, [props.cycleCompletion])

  return (
    <ClockStyles.SquareDiv // Makes the container for the clock square
      width="65%"
      >
      <ClockStyles.PrimaryCircle> 

        <ClockStyles.SecondaryCircle degree={ degree } /> 
        <ClockStyles.Ball degree={ degree } />

        <ClockStyles.Content>
          <IconButton 
            color="primary" 
            onClick={ props.toggleTracking } 
          >
            {
              props.isTracking ? (
                <StopIcon style={{ fontSize: "13rem" }}/>
              ) : (
                <PlayArrowIcon style={{ fontSize: "13rem" }}/>
              )
            }
          </IconButton>

          { props.children }          
        </ClockStyles.Content>

      </ClockStyles.PrimaryCircle>
    </ClockStyles.SquareDiv>
  )
}
