import styled from "styled-components";

const Container = styled.div`
   margin:     ${ props => props.margin || "auto" };
   box-sizing: border-box;
   padding:    ${ props => props.padding || "0px"};
   width:      ${ props => props.width || "95%" };
   height:     ${ props => props.height || "100%" }
`

const FlexContainer = styled( Container )`
   display:        flex;
   flex-direction: ${ props => props.column ? "column" : "row" };
`

const CenterFlex = styled( FlexContainer )`
   align-items:     center;
   justify-content: center;
`;

const TextInput = styled.input`
   background: ${ props => (
      props.transparent 
         ? props.theme.palette.background.default
         : props.theme.palette.background.paper
    ) };
   color:         ${ props => props.theme.palette.text.primary };
   border:        none;
   border-bottom: 2px solid ${ props => props.error ? (
      props.theme.palette.error.main     
   ) : (
      props.theme.palette.primary.main
   ) };

   width:   ${ props => props.width || "auto" };
   height:  35px;

   padding: .5rem 1rem;
   margin:  0.3rem;

   border-radius: 3px;

   &:focus {
      outline: 0;
      background: ${ props => (
         props.transparent
            ? props.theme.palette.background.paper
            : "inherit"
      )}
   }
`

const SelectInput = styled.select`
   background: ${ props => (
      props.transparent 
         ? props.theme.palette.background.default
         : props.theme.palette.background.paper
   ) };
   color:         ${ props => props.theme.palette.text.primary };
   border:        none;
   border-bottom: 2px solid ${ props => props.theme.palette.primary.main };
   border-radius: 3px;

   padding: .5rem 1rem;
   margin:  .3rem;

   cursor: pointer;

   &:active, &:focus {
      outline: none;
      background: ${ props => (
         props.transparent
            ? props.theme.palette.background.paper
            : props.theme.palette.background.default
      )}
   }
`;

const Label = styled.label`
   display:        flex;
   flex-direction: column;
   width:          ${ props => props.width || "auto" };
   margin:         ${ props => props.margin || "0 0" };

   color: ${ props => props.theme.palette.text.secondary };
`;

const Flex = styled.div`
   display: flex;
   flex-direction:   ${ props => props.column ? "column" : "row" };
   justify-content:  ${ props => props.justifyContent && props.justifyContent };
   align-items:      ${ props => props.alignItems && props.alignItems };
   height:           ${ props => props.height || "auto" };
   width:            ${ props => props.width || "auto" };
   margin:           ${ props => props.margin || "auto" };
   padding:          ${ props => props.padding || "auto" };
`;

const Font = styled.span`
   margin:  ${ props => props.margin || "auto" };
   padding: ${ props => props.padding || "auto" };
   
   font-size:     ${ props => props.size || "auto" };
   color:         ${ props => props.error ? (
         props.theme.palette.error.main
      ) : (
         props.theme.palette.text[ props.tone ] 
      ) 
   };
   font-weight:   ${ props => props.weight }
`;

const Helpers = {
   Container, FlexContainer, CenterFlex,
   TextInput, SelectInput, Label,
   Flex,
   Font
}

export default Helpers;