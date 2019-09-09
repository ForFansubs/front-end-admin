import React, { useEffect, lazy, Suspense } from 'react';
import { useDispatch, useGlobal } from 'reactn'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Wrapper from './components/hoc/wrapper';
import Login from './components/user/login'

import { useTheme } from '@material-ui/styles'

const IndexPage = lazy(() => import('./pages/index/index'))
const AnimePage = lazy(() => import('./pages/anime/index'))
const EpisodePage = lazy(() => import('./pages/bolum/index'))
const MangaPage = lazy(() => import('./pages/manga/index'))

function App() {
  const theme = useTheme()

  const getOnline = useDispatch('getOnline')
  const checkMobile = useDispatch('checkMobile')
  const checkJikanStatus = useDispatch('checkJikanStatus')
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
                    <Route path="/" exact component={IndexPage} />
                    <Route path="/anime" exact component={AnimePage} />
                    <Route path="/bolum" exact component={EpisodePage} />
                    <Route path="/manga" exact component={MangaPage} />
                  </Suspense>
                </Switch>
              </Wrapper>
            </Router>
          )
        }
        else {
          window.location.replace(process.env.REACT_APP_SITENAME);
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
