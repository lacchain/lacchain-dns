import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import { history } from 'index'
import {login, logout} from 'services/blockchain.service'
import actions from './actions'

export function* LOGIN({ payload }) {
  const { network, account } = payload;
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const address = account;
  const success = yield call( login, address )
  if ( success ) {
    localStorage.setItem( 'account', address );
    localStorage.setItem( 'network', network );

    yield put({
      type: 'user/LOAD_CURRENT_ACCOUNT',
    });
    yield history.push('/')
    notification.success({
      message: 'Logged In',
      description: 'You have successfully logged in',
    });
  }
}

export function* LOAD_CURRENT_ACCOUNT() {
  const network = localStorage.getItem( 'network' );
  const account = localStorage.getItem( 'account' );
  yield put({
    type: 'user/SET_STATE',
    payload: {
      network,
      account,
      authorized: !!account,
      loading: false,
    }
  })
}

export function* LOGOUT() {
  localStorage.removeItem( 'network' );
  localStorage.removeItem( 'account' );
  yield call( logout )
  yield put({
    type: 'user/SET_STATE',
    payload: {
      network: 0,
      account: '',
      authorized: false,
      loading: false
    }
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOGIN, LOGIN),
    takeEvery(actions.LOAD_CURRENT_ACCOUNT, LOAD_CURRENT_ACCOUNT),
    takeEvery(actions.LOGOUT, LOGOUT),
    LOAD_CURRENT_ACCOUNT(), // run once on app load to check user auth
  ])
}
