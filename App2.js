import React, {useState, useEffect} from 'react';
import {BackHandler, ToastAndroid} from 'react-native';
import {WebView} from 'react-native-webview';

let lastTime = 0;
let webview;
export function App() {
  const [canBack, setCanBack] = useState(false);
  // 获取 webview 事件返回的 canGoBack 属性 ， 判断网页是否可以回退
  const onNavigationStateChange = (navState) => {
    if (navState.canGoBack) {
      if (!canBack) {
        setCanBack(true);
      }
    } else {
      if (canBack) {
        setCanBack(false);
      }
    }
  };
  const onBackAndroid = () => {
    if (canBack) {
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
  useEffect(() => {
    console.log('add event listener');
    BackHandler.addEventListener('hardwareBackPress', onBackAndroid);
    return () => {
      console.log('remove event listener');
      BackHandler.removeEventListener('hardwareBackPress', onBackAndroid);
    };
  });
  return (
    <>
      <WebView
        ref={(w) => (webview = w)}
        onLoadEnd={this._onCustomLoading}
        nativeConfig={{props: {webContentsDebuggingEnabled: true}}}
        onNavigationStateChange={this._onNavigationStateChange}
        source={{uri: 'http://47.112.172.255/v3-mall/'}}
        // source={{uri: 'http://192.168.138.193:3000/v3-mall/'}}
      />
    </>
  );
}
