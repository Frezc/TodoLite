package com.todolite;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.RemoteViews;

/**
 * Implementation of App Widget functionality.
 */
public class TodoWidget extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        // There may be multiple widgets active, so update all of them
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }


    @Override
    public void onEnabled(Context context) {
        // Enter relevant functionality for when the first widget is created
    }

    @Override
    public void onDisabled(Context context) {
        // Enter relevant functionality for when the last widget is disabled
    }

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager,
            int appWidgetId) {

        Intent intent = new Intent(context, TodoWidgetService.class);
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);
        intent.setData(Uri.parse(intent.toUri(Intent.URI_INTENT_SCHEME)));

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.todos_widget);
        views.setRemoteAdapter(R.id.todo_list, intent);
        views.setEmptyView(R.id.todo_list, R.id.empty);

        // 设置空页面的点击
        Intent emptyIntent = new Intent(context, AppWidgetsEventReceiver.class);
        // 设置action才能带extras
        emptyIntent.setAction(AppWidgetsModule.APPWIDGET_EMPTY_CLICK);
        PendingIntent emptyPendingIntent =
                PendingIntent.getBroadcast(context, 0, emptyIntent, 0);
        views.setOnClickPendingIntent(R.id.empty, emptyPendingIntent);

        // 设置列表每项的PendingIntent Template
        Intent itemIntent = new Intent(context, AppWidgetsEventReceiver.class);
        PendingIntent pendingIntent =
                PendingIntent.getBroadcast(context, 0, itemIntent, PendingIntent.FLAG_UPDATE_CURRENT);
        views.setPendingIntentTemplate(R.id.todo_list, pendingIntent);

        // Instruct the widget manager to update the widget
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}

