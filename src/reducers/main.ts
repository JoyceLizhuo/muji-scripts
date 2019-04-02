/*
 * 通用的state
 */
import { handleActions } from 'redux-actions'
import { StoreMain } from '../@types/storeInterface'
import actionTypes from '../util/actionTypes'

const defaultState: StoreMain = {
  foo: 'init foo in main',
}

export default handleActions(
  {
    [actionTypes.main_setState]: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
  },
  defaultState,
)
