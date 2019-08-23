# Project Setup

```markdown
yarn add react-navigation
yarn add react-native-gesture-handler react-native-reanimated
```

On iOS, to complete the linking, make sure you have Cocoapods installed. Then run:

```markdown
cd ios
pod install
cd ..
```

To finalize installation of react-native-gesture-handler for Android, be sure to make the necessary modifications to MainActivity.java:

```markdown
package com.reactnavigation;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "ReactNavigation";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }

}
```

ref link: <https://reactnavigation.org/docs/en/getting-started.html>

## Documentation

Below two things are implemented in this demo for android:

- Native bridge between android and react-native
- Unlock device when app in background state

### Steps

In this section, we will make the same Javascript code which will work with Android. We will create _RNUnlockDeviceModule_ class in Java and expose the same function unlock device and getStatus to Javascript.

Open Android Studio and click on Open an existing Android Studio project and then select the android folder inside our NativeBridge app. Once all gradle dependency is downloaded, create a Java Class _RNUnlockDeviceModule.java_ inside _unlockcode_ package.

```markdown
package com.nativebridge.unlockcode;

import android.app.Activity;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.content.Context;
import android.os.PowerManager;
import android.app.KeyguardManager;
import android.app.KeyguardManager.KeyguardLock;
import android.view.Window;
import android.view.WindowManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.UiThreadUtil;

import static android.content.Context.POWER_SERVICE;

public class RNUnlockDeviceModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private static final String TAG = "RNUnlockDevice";

    public RNUnlockDeviceModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNUnlockDevice";
    }

    @ReactMethod
    public void unlock() {
        Log.d(TAG, "manualTurnScreenOn()");
        UiThreadUtil.runOnUiThread(new Runnable() {
            public void run() {
                Activity mCurrentActivity = getCurrentActivity();
                if (mCurrentActivity == null) {
                    Log.d(TAG, "ReactContext doesn't have any Activity attached.");
                    return;
                }
                KeyguardManager keyguardManager = (KeyguardManager) reactContext.getSystemService(Context.KEYGUARD_SERVICE);
                KeyguardLock keyguardLock = keyguardManager.newKeyguardLock(Context.KEYGUARD_SERVICE);
                keyguardLock.disableKeyguard();

                PowerManager powerManager = (PowerManager) reactContext.getSystemService(POWER_SERVICE);
                PowerManager.WakeLock wakeLock = powerManager.newWakeLock(
                        PowerManager.FULL_WAKE_LOCK
                                | PowerManager.ACQUIRE_CAUSES_WAKEUP
                                | PowerManager.SCREEN_BRIGHT_WAKE_LOCK
                                | PowerManager.ON_AFTER_RELEASE, "TavrTalk:RNUnlockDeviceModule");

                wakeLock.acquire(10000);

                Window window = mCurrentActivity.getWindow();
                window.addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                        WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
                        WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
                        WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON |
                        WindowManager.LayoutParams.FLAG_ALLOW_LOCK_WHILE_SCREEN_ON
                );

                Intent dialogIntent = getReactApplicationContext().getPackageManager().getLaunchIntentForPackage(reactContext.getPackageName());
                if (dialogIntent != null) {
                    dialogIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                }
                getReactApplicationContext().startActivity(dialogIntent);
            }
        });
    }

}
```

We have created a _RNUnlockDeviceModule_ Java class which is inherited from ReactContextBaseJavaModule. ReactContextBaseJavaModule requires that a function called _getName_ is always implemented. The purpose of this method is to return the string name of the NativeModule which represents this class in JavaScript. So here we will call this _RNUnlockDeviceModule_ so that we can access it through _React.NativeModules.RNUnlockDeviceModule_ in JavaScript. Instead of _RNUnlockDeviceModule_, we can have a different name also.

> Not all function is exposed to Javascript explicitly, to expose a function to JavaScript a Java method must be annotated using @ReactMethod. The return type of bridge methods is always void.

We have also created a _unlock_ function which will unlock device if app is in background or foreground state and our device is in lock mode.

Next step is to register the module, if a module is not registered it will not be available from JavaScript. Create a file by clicking on Menu File -> New -> Java Class and the file name as _RNUnlockDevicePackage_ and then click OK. And then add following code to _RNUnlockDevicePackage.java_

```markdown
package com.nativebridge.unlockcode;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class RNUnlockDevicePackage implements ReactPackage {

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Arrays.asList(new RNUnlockDeviceModule(reactContext));
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

}
```

We need to Override _createNativeModules_ function and add the _RNUnlockDeviceModule_ object to modules array. If this is not added here then it will not be available in JavaScript.

_RNUnlockDevicePackage_ package needs to be provided in the _getPackages_ method of the _MainApplication.java_ file.

```markdown
@Override
protected List<ReactPackage> getPackages() {

    @SuppressWarnings("UnnecessaryLocalVariable")
    List<ReactPackage> packages = new PackageList(this).getPackages();

    //Add below line
    packages.add(new RNUnlockDevicePackage());

    return packages;

}
```

To invoke method use below code in your _js_ file

```markdown
import RNUnlockDevice from "./RNUnlockDevice";

RNUnlockDevice.unlock();
```

Now create _RNUnlockDevice.js_ file inside src/utility folder for calling _NativeModules_

```markdown
import { NativeModules } from 'react-native';

const { RNUnlockDevice } = NativeModules;

export default RNUnlockDevice;
```

## Some Useful Links

- <https://facebook.github.io/react-native/docs/native-modules-android>
- <https://github.com/wix/react-native-notifications/issues/42>
