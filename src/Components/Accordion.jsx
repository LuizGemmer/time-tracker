import React, { useState } from 'react'

import { AccordionBody, AccordionHeader, AccordionContent } from '../styles/Accordion';
import Helpers from '../styles/Helpers';

import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";


export default function Accordion( props ) {
  const [open, setOpen] = useState( false );

  return (
    <AccordionBody 
      column 
      width="100%" 
      margin="none"
      open={ open }
    >
      <AccordionHeader 
        onClick={ () => setOpen( !open ) }
      >
        <Helpers.Flex
          justifyContent="space-around"
          alignItems="center"
          margin=".5rem"
          width="100%"
        >
          {
            open ? (
              <ArrowDropUpIcon />
              ) : (
              <ArrowDropDownIcon />
            )
          }
          <Helpers.Font
            margin="0 1rem"
            size="18px"
          >
            { props.title }
          </Helpers.Font>

          {
            props.summary && (
              <Helpers.Font margin="0 1rem 0 auto" tone="secondary">
                { props.summary }
              </Helpers.Font>
            )
          }
        </Helpers.Flex>
      </AccordionHeader>
      <AccordionContent width="95%" column>
        { props.children }
      </AccordionContent>
    </AccordionBody>
  )
}
