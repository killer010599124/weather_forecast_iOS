// store/reducers/myReducer.js


const initialState = {
  alertVariable: [],
  locationListVariable: [],
  unitVariable: true,
  myPostionVariable: null,
  currentLocationVariable: null
};

const myReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'alertData':
      return {
        ...state,
        alertVariable: action.payload,
      };
    case 'locationList':
      return {
        ...state,
        locationListVariable: action.payload,
      };
    case 'unit':
      return {
        ...state,
        unitVariable: action.payload,
      };
    case 'myPosition':
      return {
        ...state,
        myPostionVariable: action.payload,
      };
    case 'currentLocation':
      return {
        ...state,
        currentLocationVariable: action.payload,
      };
    default:
      return state;
  }
};

export default myReducer;