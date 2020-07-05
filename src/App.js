import React, { useEffect, lazy, Suspense } from 'react';
import { useDispatch, useGlobal } from 'reactn'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Wrapper from './components/hoc/wrapper';
import Login from './components/user/login'

import { useTheme } from '@material-ui/styles'

const IndexSayfa = lazy(() => import('./pages/index/index'))
const AnimeSayfa = lazy(() => import('./pages/anime/index'))
const BolumSayfa = lazy(() => import('./pages/bolum/index'))
const MangaSayfa = lazy(() => import('./pages/manga/index'))
const MangaBolumSayfa = lazy(() => import('./pages/manga_bolum/index'))
const IcerikListeSayfa = lazy(() => import('./pages/icerik-liste/index'))
const MotdSayfa = lazy(() => import('./pages/motd/index'))
const KullaniciSayfa = lazy(() => import('./pages/user/index'))
const YetkiSayfa = lazy(() => import('./pages/perms/index'))
const KayitlarSayfa = lazy(() => import('./pages/kayitlar/index'))

function App() {
  const theme = useTheme()

  const getOnline = useDispatch('getOnline')
  const checkMobile = useDispatch('checkMobile')
  const checkJikanStatus = useDispatch('checkJikanStatus')
  const logoutHandler = useDispatch('logoutHandler')
  const [online] = useGlobal('online')
  const [isAdmin] = useGlobal('isAdmin')
  const [isAdminChecked] = useGlobal('isAdminChecked')
  const [user] = useGlobal('user')

  useEffect(() => {
    getOnline()
    checkMobile(navigator.userAgent || navigator.vendor || window.opera)
    checkJikanStatus()
  }, [getOnline, checkMobile, checkJikanStatus])

  if (online === true) {
    if (user.token) {
      if (isAdminChecked) {
        if (isAdmin) {
          return (
            <Router basename="/admin">
              <Wrapper>
                <Switch>
                  <Suspense fallback={<p></p>}>
                    <Route path="/" exact component={IndexSayfa} />
                    <Route path="/anime" exact component={AnimeSayfa} />
                    <Route path="/bolum" exact component={BolumSayfa} />
                    <Route path="/manga" exact component={MangaSayfa} />
                    <Route path="/manga-bolum" exact component={MangaBolumSayfa} />
                    <Route path="/icerik-listesi" exact component={IcerikListeSayfa} />
                    <Route path="/motd" exact component={MotdSayfa} />
                    <Route path="/kullanici" exact component={KullaniciSayfa} />
                    <Route path="/yetki" exact component={YetkiSayfa} />
                    <Route path="/kayitlar" exact component={KayitlarSayfa} />
                  </Suspense>
                </Switch>
              </Wrapper>
            </Router>
          )
        }
        else if (!user.token && isAdmin === false) {
          logoutHandler()
          window.location.replace(process.env.REACT_APP_SITEURL)
          return (
            <>Bu sayfaya girme yetkiniz yok!</>
          )

        }
      }
      else return (
        <p>Yükleniyor</p>
      )
    }
    else {
      return (
        <Login theme={theme} />
      )
    }
  }
  else if (online === false) return (
    <p>Bağlantı hatası</p>
  )

  else return (
    <p>Yükleniyor</p>
  )
}

export default App;
