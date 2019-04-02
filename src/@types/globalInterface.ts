import m from 'moment'
import { compose } from 'redux'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose
    immutable: {}
    requirejs?: () => {}
    m?: typeof m
    store: () => {}
    rxjs: {}
  }
}
