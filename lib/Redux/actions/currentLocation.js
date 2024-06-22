// store/actions/myActions.js
export const saveCurrentLocationVariable = (value) => ({
    type: 'currentLocation',
    payload: value,
  });