import React from 'react'
import './App.css';
import { defaultTheme, Flex, Provider as ProviderV3, View } from '@adobe/react-spectrum';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import MainView from './components/main/MainViewContainer';
import store from './data/redux/store/AppStore';
import {
  HashRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import { HeaderBar } from './components/headerBar/HeaderBar';
import { Why } from './components/why/Why';
import { FooterBar } from './components/footerBar/FooterBar';
import { Commanders } from './components/commanders/Commanders';
import { useDispatch, useSelector } from 'react-redux';
import { hydrate } from './data/redux/slices/appSlice';
// import history from './data/history/AppHistory';

export default function App() {
  // try {
  //   const dispatch = useDispatch();
  //   // eslint-disable-next-line react-hooks/rules-of-hooks
  //   const isHydrated = useSelector((state) => state.app.isHydrated);

  //   if (!isHydrated) {
  //     dispatch(hydrate());
  //   }
  // } catch (error) {
  //   console.log(`... unable to hydrate.`);
  // }

  return (
    <div style={{ backgroundColor: "red" }}>
      <Provider store={store}>
        <ProviderV3 theme={defaultTheme} colorScheme="dark">
          <Router> 
            <ToastContainer />
            <Flex
              id="AppContainer"
              width="100vw"
              height="100vh"
              direction="column">
              <HeaderBar />
              <Flex
                id="ContentContainer"
                direction="row"
                height="100%"
                width="100%"
                justifyContent="space-around"
              >
                <View
                  id="CenterContentContainer"
                  direction="column"
                  height="auto"
                  width="100%"
                  maxWidth="1200px"
                  marginBottom="40px"
                >
                  <Routes>
                    <Route path='/' element={< MainView />}></Route>
                    <Route path='/commanders' element={< Commanders />}></Route>
                    <Route path='/why' element={< Why />}></Route>
                  </Routes>
                </View>
              </Flex>
              <FooterBar />
            </Flex>
        </Router>
      </ProviderV3>
    </Provider>
    </div>
  );

}
