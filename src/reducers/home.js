export default function home(state = {}, action) {
  switch (action.type) {
    case 'SOCKET_CONNECTED':
      return {
        ...state,
        data: action.data,
      };
    default:
      return state;
  }
}
