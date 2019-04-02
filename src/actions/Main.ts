import Redux from 'redux'
import { createAction } from 'redux-actions'
import actionTypes from '../util/actionTypes'

const setState = createAction(actionTypes.main_setState)

/*
 * 设置state
 * @param payload
 * @returns {Function}
 */
export const setMainState = (payload: {}) => {
  return (dispatch: Redux.Dispatch) => dispatch(setState({ ...payload }))
}
