import React  from 'react'
import { connect } from 'react-redux'
import { Radio, Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import style from '../style.module.scss'
import MetaMaskLogin from "../../../../custom/metamask-login";

const mapStateToProps = ({ user, settings, dispatch }) => ({
  dispatch,
  user,
  authProvider: settings.authProvider,
  logo: settings.logo,
})

const Login = ({ dispatch, authProvider, logo }) => {

  const changeAuthProvider = value => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'authProvider',
        value,
      },
    })
  }

  return (
    <div>
      <div className="text-center mb-5">
        <h1 className="mb-5 px-3">
          <strong>Welcome to {logo} DNS</strong>
        </h1>
        <p>
          A Decentralized Application (DApp) for DID Name Service.
        </p>
      </div>
      <div className={`card ${style.container}`}>
        <div className="text-dark font-size-24 mb-3">
          <strong>Sign in to your account</strong>
        </div>
        <div className="mb-4">
          <Radio.Group onChange={e => changeAuthProvider(e.target.value)} value={authProvider}>
            <Tooltip title="Using Metamask Plugin">
              <Radio disabled={!window.ethereum} value="metamask">
                Metamask
              </Radio>
            </Tooltip>
          </Radio.Group>
        </div>
        <MetaMaskLogin />
      </div>
      { false &&
        <div className="text-center pt-2 mb-auto">
          <span className="mr-2">Don&#39;t have an account?</span>
          <Link to="/auth/register" className="kit__utils__link font-size-16">
            Sign up
          </Link>
        </div>
      }
    </div>
  )
}

export default connect(mapStateToProps)(Login)
