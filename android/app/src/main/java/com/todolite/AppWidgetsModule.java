package com.todolite;

import android.app.Activity;
import android.appwidget.AppWidgetManager;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

/**
 * Created by Frezc on 2016/6/21.
 */
public class AppWidgetsModule extends ReactContextBaseJavaModule {
    public static final String APPWIDGETS_EVENT = "AppWidgetsEvent";
    public static final String APPWIDGET_CLICK = "AppWidgetClick";
    public static final String APPWIDGET_EMPTY_CLICK = "AppWidgetEmptyClick";

    private Context context;
    private Activity activity;

    public AppWidgetsModule(ReactApplicationContext reactContext, Activity activity) {
        super(reactContext);
        this.context = reactContext;
        this.activity = activity;
        listenAppWidgetsEvent();
    }

    @Override
    public String getName() {
        return "AppWidgetsModule";
    }

    @ReactMethod
    public void getInitialSysAppWidgets(Callback cb) {
        if (activity == null) return;

        Intent intent = activity.getIntent();
        Bundle extras = intent.getExtras();

        if (extras != null) {
            String initialSysAppWidgetAction = extras.getString("initialSysAppWidgetAction");
            if (initialSysAppWidgetAction != null) {
                cb.invoke(extras.getString("initialSysAppWidgetAction"),
                          extras.getString("initialSysAppWidgetPayload"));
            }
        }
    }

    @ReactMethod
    public void removeInitialSysAppWidgets() {
        if (activity == null) {
            return;
        }

//        activity.getIntent().removeExtra("initialSysAppWidgetId");
        activity.getIntent().removeExtra("initialSysAppWidgetAction");
        activity.getIntent().removeExtra("initialSysAppWidgetPayload");
    }

    @ReactMethod
    public void update() {
        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
        appWidgetManager.notifyAppWidgetViewDataChanged(
                appWidgetManager.getAppWidgetIds(new ComponentName(context, TodoWidget.class)),
                R.id.todo_list);
    }

    /**
     * Emit JavaScript events.
     */
    private void sendEvent(
            String eventName,
            Object params
    ) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);

        Log.i("ReactSystemAppWidgets", "AppWidgetsModule: sendEvent (to JS): " + eventName);
    }

    private void listenAppWidgetsEvent() {
        IntentFilter intentFilter = new IntentFilter(APPWIDGETS_EVENT);
        getReactApplicationContext().registerReceiver(new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                Bundle extras = intent.getExtras();

                WritableMap params = Arguments.createMap();
//                params.putInt("id", extras.getInt(AppWidgetsEventReceiver.ID));
                params.putString("action", extras.getString(AppWidgetsEventReceiver.ACTION));
                params.putString("payload", extras.getString(AppWidgetsEventReceiver.PAYLOAD));

                sendEvent("sysModuleAppWidgetsClick", params);
            }
        }, intentFilter);
    }
}
