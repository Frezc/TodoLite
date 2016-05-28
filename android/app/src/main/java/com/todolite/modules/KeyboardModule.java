package com.todolite.modules;

import android.app.Activity;
import android.view.View;
import android.view.ViewTreeObserver;
import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Frezc on 2016/5/27.
 */
public class KeyboardModule extends ReactContextBaseJavaModule {

    private static final String VISIBLE_CHANGE = "visibleChange";

    private List<Callback> callbacks = new ArrayList<>();

    private boolean isOpened = false;


    public KeyboardModule(final ReactApplicationContext reactContext, Activity activity) {
        super(reactContext);

        final View activityRootView = activity.getWindow().getDecorView().findViewById(android.R.id.content);
        activityRootView.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                int heightDiff = activityRootView.getRootView().getHeight() - activityRootView.getHeight();
                if (heightDiff > 100) { // 99% of the time the height diff will be due to a keyboard.
//                    for (Callback callback : callbacks) {
//                        callback.invoke(true);
//                    }
//                    if(!isOpened) {
//                        //Do two things, make the view top visible and the editText smaller
//                    }

                    sendEvent(reactContext, true);
                    isOpened = true;
                } else if (isOpened) {
//                    for (Callback callback : callbacks) {
//                        callback.invoke(false);
//                    }

                    sendEvent(reactContext, false);
                    isOpened = false;
                }
            }
        });
    }

    private void sendEvent(ReactContext reactContext, boolean isVisible) {
        WritableMap params = Arguments.createMap();
        params.putBoolean("isVisible", isVisible);

        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("KeyboardVisibleChanged", params);
    }

    @Override
    public String getName() {
        return "KeyboardAndroid";
    }

    @ReactMethod
    public void addEventListener(String eventName, Callback callback) {
        if (VISIBLE_CHANGE.equals(eventName)) {
            callbacks.add(callback);
        }
    }

    @ReactMethod
    public void removeListener(String eventName, Callback callback) {
        if (VISIBLE_CHANGE.equals(eventName)) {
            callbacks.remove(callback);
        }
    }
}
