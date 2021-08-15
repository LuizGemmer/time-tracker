import styled from "styled-components"

const SquareDiv = styled.div`
  margin: 0px auto;

  display:          flex;
  aling-items:      center;
  justify-content:  center;
  
  position: relative;
  width:    ${ props => props.width || "auto" };

  &:after {
    content:        "";
    display:        block;
    padding-bottom: 100%;
  }
`;

const PrimaryCircle = styled.div`
  position: absolute;
  height:   100%;
  width:    100%;

  border-radius:  50%;
  border:         6px solid ${ props => props.theme.palette.primary.main }
`;

const SecondaryCircle = styled.div`
  position: absolute;
  left:     -7.5px;
  top:      -7.5px;

  height: calc( 100% + 15px );
  width:  calc( 100% + 15px );

  background: conic-gradient( 
    ${ ({ theme }) => theme.palette.background.default } ${ ({ degree }) => `${ degree }deg` },
    transparent ${ ({ degree }) => `${ degree }deg` } 360deg
  );
  border-radius: 50%;
`;

const Ball = styled.div`
    position:        absolute;
    left:            50%;
    height:          50%;
    transform:       rotate( ${ ({ degree }) => `${ degree }deg` } );
    transform-origin: bottom left;
    
    &:after {
      content:    "";
      display:    block;
      background: ${ props => props.theme.palette.primary.main };
      box-shadow: ${ props => props.theme.shadows[1] };

      width:          15px;
      height:         15px;
      transform:      translate( -7.5px, -10px );
      border-radius:  50%;
    }
`;

const Content = styled.div`
    display:        flex;
    align-items:    center;
    flex-direction: column;
    
    position:   absolute;
    top:        50%;
    left:       50%;
    transform:  translate( -50%, -45% );
`;

const ClockStyles = {
  SquareDiv, PrimaryCircle, SecondaryCircle, Ball,
  Content,
}

export default ClockStyles