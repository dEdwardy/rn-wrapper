import React, {useState, useEffect} from 'react';
import {BackHandler} from 'react-native';
import {WebView} from 'react-native-webview';
import SplashScreen from 'react-native-splash-screen';

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
  const onLoadEnd = () => {
    SplashScreen.hide();
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
  const INJECTED_JAVASCRIPT = `(function() {
    window.ReactNativeWebView.postMessage(JSON.stringify({enviroment:'app'}));
  })()`;
  return (
    <>
      <WebView
        ref={(w) => (webview = w)}
        nativeConfig={{props: {webContentsDebuggingEnabled: true}}}
        onLoadEnd={onLoadEnd}
        onNavigationStateChange={onNavigationStateChange}
        onMessage={(e) => console.log(e)}
        injectedJavaScriptBeforeContentLoaded={INJECTED_JAVASCRIPT}
        startInLoadingState={false}
        // source={{uri: 'http://edw4rd.cn/v3-mall/'}}
        source={{uri: 'http://edw4rd.cn/v3-mall/'}}
        onError={(syntheticEvent) => {
          const {nativeEvent} = syntheticEvent;
          console.log('WebView error: ', nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const {nativeEvent} = syntheticEvent;
          console.log(
            'WebView received error status code: ',
            nativeEvent.statusCode,
          );
        }}
        // source={{uri: 'http://192.168.138.193:3000/v3-mall/'}}
      />
    </>
  );
}
