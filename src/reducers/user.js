const initialState = {
  loggedIn: false,
  token: ''
}

const login = (state = initialState, action) => {
  switch (action.type) {
    case 'SAVE_TOKEN':
      return Object.assign({}, state, {
        loggedIn: true,
        token: action.token
      })

    case 'LOGOUT':
      return initialState

    default:
      return state
  }
}

export default login
