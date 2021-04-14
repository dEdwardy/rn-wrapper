import React from 'react';
import {BackHandler, ToastAndroid} from 'react-native';
import {WebView} from 'react-native-webview';

let lastTime = 0;
class App extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
  }
  onBackAndroid = () => {
    // eslint-disable-next-line no-undef
    if (global.isBack) {
      let time = Date.now();
      console.log(time - lastTime - 2000);
      if (time - lastTime <= 2000) {
        BackHandler.exitApp();
        return false;
      } else {
        lastTime = time;
        // ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
        // eslint-disable-next-line no-undef
        webview.goBack();
        return true;
      }
    } else {
      BackHandler.exitApp();
      return false;
    }
  };
  // 获取 webview 事件返回的 canGoBack 属性 ， 判断网页是否可以回退
  _onNavigationStateChange(navState) {
    if (navState.canGoBack) {
      global.isBack = true;
    } else {
      global.isBack = false;
    }
  }
  _onCustomLoading() {
    global.webview.postMessage('rn');
  }
  render() {
    return (
      <>
        <WebView
          ref={(w) => (global.webview = w)}
          onLoadEnd={this._onCustomLoading}
          nativeConfig={{props: {webContentsDebuggingEnabled: true}}}
          onNavigationStateChange={this._onNavigationStateChange}
          // onMessage={this._onCustomLoading}
          source={{uri: 'http://47.112.172.255/v3-mall/'}}
          // source={{uri: 'http://192.168.138.193:3000/v3-mall/'}}
        />
      </>
    );
  }
}

export default App;
