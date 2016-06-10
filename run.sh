#!/bin/bash
cordova run android --device

adb logcat | grep "CONSOLE"
