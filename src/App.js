import React from 'react';
import './App.css';
import { defaultTheme, Flex, Provider as ProviderV3, View } from '@adobe/react-spectrum';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FullHeight from 'react-full-height';
import { Provider } from 'react-redux';
import MainView from './components/main/MainViewContainer';
import store from './data/redux/store/AppStore';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import { HeaderBar } from './components/headerBar/HeaderBar';
import { Why } from './components/why/Why';
import { FooterBar } from './components/footerBar/FooterBar';

class App extends React.Component {
  render() {
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
                  >
                    <Routes>
                      <Route exact path='/' element={< MainView />}></Route>
                      <Route exact path='/why' element={< Why />}></Route>
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
}

export default App;
