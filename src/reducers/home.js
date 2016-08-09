export default function home(state = { data: { components: [] } }, action) {
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
