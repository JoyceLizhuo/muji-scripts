import './index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import immutable from 'immutable'
import rxjs from 'rxjs'
import { Provider } from 'react-redux'
import { Router, Redirect, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import './@types/globalInterface'
import BodyTip from './components/BodyTip'
import CssAndReact from './components/CssAndReact/CssAndReact'
import RouteWithPagesDecorator from './components/RouteWithPagesDecorator'
import PagesDecorator from './Decorator/Pages'
import * as reducers from './reducers/reducers'
import Home from './routes/Home'
import NotFind from './routes/NotFind'
import routerPath from './util/routerPath'
const RxjsPage = React.lazy(() =>
  import(/* webpackChunkName: "rxjsPage" */ './routes/Rxjs'),
)
const Lazy = React.lazy(() =>
  import(/* webpackChunkName: "lazyPage" */ './routes/Lazy'),
)
const BatchUpdate = React.lazy(() =>
  import(/* webpackChunkName: "batchUpdatePage" */ './routes/BatchUpdate'),
)
const Snail = React.lazy(() =>
  import(/* webpackChunkName: "snail" */ './routes/Snail'),
)

const combinedReducer = combineReducers(reducers)

// 开发环境下开启redux调试
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  combinedReducer,
  composeEnhancer(applyMiddleware(thunk)),
)

if (process.env.NODE_ENV !== 'production') {
  window.store = () => {
    console.error('only for debug!')
    return store
  }
  window.immutable = immutable
  window.rxjs = rxjs
}

const FallBack = (
  <PagesDecorator>
    <BodyTip>Loading...</BodyTip>
  </PagesDecorator>
)

const history = createBrowserHistory()

const provider = (
  <Provider store={store}>
    <Router history={history}>
      <React.Suspense fallback={FallBack}>
        <Switch>
          <Redirect exact from="/" to={routerPath.home} />
          <Route exact path={routerPath.home} component={Home} />
          <RouteWithPagesDecorator
            exact
            path={routerPath.cssAndReact}
            component={CssAndReact}
          />
          <RouteWithPagesDecorator
            exact
            path={routerPath.lazy}
            component={Lazy}
          />
          <RouteWithPagesDecorator
            exact
            path={routerPath.batchUpdate}
            component={BatchUpdate}
          />
          <RouteWithPagesDecorator
            exact
            path={routerPath.rxjs}
            component={RxjsPage}
          />
          <RouteWithPagesDecorator
            exact
            path={routerPath.snail}
            component={Snail}
          />
          <RouteWithPagesDecorator component={NotFind} />
        </Switch>
      </React.Suspense>
    </Router>
  </Provider>
)

ReactDOM.render(provider, document.getElementById('root'))
