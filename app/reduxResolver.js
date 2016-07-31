export default function resolveAction(initialState, handlers) {
  return function resolve(state = initialState, action) {
    return handlers[action.type] ? handlers[action.type](state, action) : state
  }
}
