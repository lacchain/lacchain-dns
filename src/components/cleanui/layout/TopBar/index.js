import React from 'react'
import LanguageSwitcher from './LanguageSwitcher'
import Actions from './Actions'
import UserMenu from './UserMenu'
import style from './style.module.scss'

const TopBar = () => {
  return (
    <div className={style.topbar}>
      <div className="mr-auto">
        <div className={style.logoContainer}>
          <div className={style.logo}>
            <img src="resources/images/chains/lacchain.png" width="35" className="mr-2" alt="LACChain" />
            <div className={style.name}>LACChain</div>
            <div className={style.descr}>DNS</div>
          </div>
        </div>
      </div>
      <div className="mb-0 mr-auto d-xl-block d-none" />
      <div className="mr-4 d-none d-sm-block">
        <LanguageSwitcher />
      </div>
      {false &&
      <div className="mr-4 d-none d-sm-block">
        <Actions />
      </div>
      }
      <div className="">
        <UserMenu />
      </div>
    </div>
  )
}

export default TopBar
