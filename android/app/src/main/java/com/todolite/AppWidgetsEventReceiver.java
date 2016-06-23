package com.todolite;

import android.app.ActivityManager;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import java.util.List;

public class AppWidgetsEventReceiver extends BroadcastReceiver {
//    public static final String ID = "id";
    public static final String ACTION = "action";
    public static final String PAYLOAD = "payload";

    @Override
    public void onReceive(Context context, Intent intent) {
        Bundle extras = intent.getExtras();
        String action = intent.getAction();

        if (!applicationIsRunning(context)) {
            String packageName = context.getApplicationContext().getPackageName();
            Intent launchIntent = context.getPackageManager().getLaunchIntentForPackage(packageName);
//            launchIntent.putExtra("initialSysAppWidgetId", extras.getInt(ID));
            launchIntent.putExtra("initialSysAppWidgetAction", action);
            if (extras != null) {
                launchIntent.putExtra("initialSysAppWidgetPayload", extras.getString(PAYLOAD));
            }
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);

            context.startActivity(launchIntent);
        } else {
            sendBroadcast(context, intent);
        }
    }

    private void sendBroadcast(Context context, Intent intent) {
        Intent brodcastIntent = new Intent(AppWidgetsModule.APPWIDGETS_EVENT);
        Bundle extras = intent.getExtras();
        String action = intent.getAction();
//        brodcastIntent.putExtra("id", extras.getInt(ID));
        brodcastIntent.putExtra("action", action);
        if (extras != null) {
            brodcastIntent.putExtra("payload", extras.getString(PAYLOAD));
        }

        context.sendBroadcast(brodcastIntent);
    }

    private boolean applicationIsRunning(Context context) {
        ActivityManager activityManager = (ActivityManager) context.getSystemService(context.ACTIVITY_SERVICE);

        if (Build.VERSION.SDK_INT > Build.VERSION_CODES.KITKAT_WATCH) {
            List<ActivityManager.RunningAppProcessInfo> processInfos = activityManager.getRunningAppProcesses();
            for (ActivityManager.RunningAppProcessInfo processInfo : processInfos) {
                if (processInfo.processName.equals(context.getApplicationContext().getPackageName())) {
                    if (processInfo.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND) {
                        for (String d: processInfo.pkgList) {
                            Log.v("ReactSystemAppWidgets", "NotificationEventReceiver: ok: " + d);
                            return true;
                        }
                    }
                }
            }
        } else {
            List<ActivityManager.RunningTaskInfo> taskInfo = activityManager.getRunningTasks(1);
            ComponentName componentInfo = taskInfo.get(0).topActivity;
            if (componentInfo.getPackageName().equals(context.getPackageName())) {
                return true;
            }
        }

        return false;
    }
}
