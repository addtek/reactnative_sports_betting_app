package com.addtek.sportsbook;

import android.app.Notification;
import android.os.Bundle;
import android.content.Context;


import com.wix.reactnativenotifications.core.notification.PushNotification;
import com.wix.reactnativenotifications.core.NotificationIntentAdapter;
import com.wix.reactnativenotifications.core.AppLaunchHelper;
import com.wix.reactnativenotifications.core.AppLifecycleFacade;
import com.wix.reactnativenotifications.core.JsIOHelper;

public class CustomNotification extends PushNotification{

    public CustomNotification (Context context, Bundle bundle, AppLifecycleFacade appLifecycleFacade, AppLaunchHelper appLaunchHelper, JsIOHelper jsIoHelper){
        super(context, bundle, appLifecycleFacade, appLaunchHelper, jsIoHelper);
    }
}