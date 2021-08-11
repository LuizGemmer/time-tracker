import styled from "styled-components";

const Container = styled.div`
   margin: auto;
   box-sizing: border-box;
   padding: ${ props => props.padding || "0px"};
   width: ${ props => props.width || "95%" };
   height: ${ props => props.height || "100%" }
`

const FlexContainer = styled(Container)`
   display: flex;
`

const CenterFlex = styled( FlexContainer )`
   aling-items: center;
   justify-content: center;
`;

const TextInput = styled.input`
   background: ${ props => (
      props.transparent 
         ? props.theme.palette.background.default
         : props.theme.palette.background.paper
    ) };
   color: ${ props => props.theme.palette.text.primary };
   border: none;
   border-bottom: 2px solid ${ props => props.theme.palette.primary.main };

   padding: .5rem 1rem;
   margin: .5rem;

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
   color: ${ props => props.theme.palette.text.primary };
   border: none;
   border-bottom: 2px solid ${ props => props.theme.palette.primary.main };

   padding: .5rem 1rem;
   margin: .5rem;

   cursor: pointer;

   &:active, &:focus {
      outline: none;
   }
`;

const Helpers = {
   Container, FlexContainer, CenterFlex,
   TextInput, SelectInput, Option
}

export default Helpers;