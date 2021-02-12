import * as React from 'react';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  console.log("gonna navigate to " + name);
  console.log("is nav ref current " + navigationRef.current);
  navigationRef.current?.navigate(name, params);
}
