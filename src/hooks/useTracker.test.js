import useTracker from "./useTracker";
import {render, act} from '@testing-library/react'

jest.mock( "./useIPC", () => ({}))

function setHookUp( ...args ) {
  const returnVal = {};
  function TestComponent() {
    Object.assign( returnVal, useTracker( ...args ) );
    return null;
  }
  render( <TestComponent /> );
  return returnVal;
};

describe( "useTracker", () => {
  let tracker = setHookUp( undefined, true );
  beforeEach( () => tracker = setHookUp( undefined, true) );

  it( "should format time strings to the format [[hh]:mm]:ss", () => {
    const { formatTimeToString } = tracker;

    expect( formatTimeToString( 59 ) ).toMatch( "59" );
    // 5 minutes
    expect( formatTimeToString( 300 ) ).toMatch( "05:00" );
    // 1 hour and 5 minutes
    expect( formatTimeToString( 3900 ) ).toMatch( "01:05:00" );
  } )

  it('should start and stop tracking', async () => {
    jest.useFakeTimers();

    // Asserts initial state
    expect( tracker.track.isTracking ).toBe( false );
    expect( tracker.track.start ).toBe( undefined );

    act( () => {
      tracker.start();
    } );

    expect( tracker.track.isTracking ).toBe( true );
    expect( typeof tracker.track.start ).toBe( "number" );

    act( () => { tracker.stop() } );

    expect( tracker.track.isTracking ).toBe( false );
    expect( typeof tracker.track.start ).toBe( "number" );

    jest.useRealTimers();
  });
} )