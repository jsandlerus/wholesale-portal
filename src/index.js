import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import store from './redux/store'
import { Provider } from 'react-redux'
import { initializeAllRequests } from './index-init'

function getPlatform() {
  let platform = navigator.appVersion
  if (platform.indexOf('iPhone') !== -1 || platform.indexOf('iPad') !== -1 || platform.indexOf('Android') !== -1) {
    store.dispatch({ type: "SET_MOBILE" })
    return 'mobile'
  }
  else {
    return 'browser'
  }
}

let platform = getPlatform()
if (platform === 'mobile') {
  ReactDOM.render(
    <h1 style={{"textAlign": 'center', 'transform': 'translateY(50%)'}}>
      This app sells bulk CBD products and as such is recommended for desktop use only. Register an account with us at
    <a className='light_green' href='tel:7205916284'>
        (720)591-6284
    </a>
    </h1>, document.getElementById("root"))

}
else {
  initializeAllRequests()

  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  )
}


