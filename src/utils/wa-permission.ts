/* eslint-disable */
// @ts-nocheck
/**
 * 本模块封装了Android、iOS的应用权限判断、打开应用权限设置界面、以及位置系统服务是否开启
 * https://ext.dcloud.net.cn/plugin?id=594
 */

let isIos
// #ifdef APP-PLUS
isIos = plus.os.name == 'iOS'
// #endif

// 判断推送权限是否开启
function judgeIosPermissionPush() {
  let result = false
  const UIApplication = plus.ios.import('UIApplication')
  const app = UIApplication.sharedApplication()
  let enabledTypes = 0
  if (app.currentUserNotificationSettings) {
    const settings = app.currentUserNotificationSettings()
    enabledTypes = settings.plusGetAttribute('types')
    console.log('enabledTypes1:' + enabledTypes)
    if (enabledTypes == 0) {
      console.log('推送权限没有开启')
    } else {
      result = true
      console.log('已经开启推送功能!')
    }
    plus.ios.deleteObject(settings)
  } else {
    enabledTypes = app.enabledRemoteNotificationTypes()
    if (enabledTypes == 0) {
      console.log('推送权限没有开启!')
    } else {
      result = true
      console.log('已经开启推送功能!')
    }
    console.log('enabledTypes2:' + enabledTypes)
  }
  plus.ios.deleteObject(app)
  plus.ios.deleteObject(UIApplication)
  return result
}

// 判断定位权限是否开启
function judgeIosPermissionLocation() {
  let result = false
  const cllocationManger = plus.ios.import('CLLocationManager')
  const status = cllocationManger.authorizationStatus()
  result = status != 2
  console.log('定位权限开启：' + result)
  // 以下代码判断了手机设备的定位是否关闭，推荐另行使用方法 checkSystemEnableLocation
  /* var enable = cllocationManger.locationServicesEnabled();
	var status = cllocationManger.authorizationStatus();
	console.log("enable:" + enable);
	console.log("status:" + status);
	if (enable && status != 2) {
		result = true;
		console.log("手机定位服务已开启且已授予定位权限");
	} else {
		console.log("手机系统的定位没有打开或未给予定位权限");
	} */
  plus.ios.deleteObject(cllocationManger)
  return result
}

// 判断麦克风权限是否开启
function judgeIosPermissionRecord() {
  let result = false
  const avaudiosession = plus.ios.import('AVAudioSession')
  const avaudio = avaudiosession.sharedInstance()
  const permissionStatus = avaudio.recordPermission()
  console.log('permissionStatus:' + permissionStatus)
  if (permissionStatus == 1684369017 || permissionStatus == 1970168948) {
    console.log('麦克风权限没有开启')
  } else {
    result = true
    console.log('麦克风权限已经开启')
  }
  plus.ios.deleteObject(avaudiosession)
  return result
}

// 判断相机权限是否开启
function judgeIosPermissionCamera() {
  let result = false
  const AVCaptureDevice = plus.ios.import('AVCaptureDevice')
  const authStatus = AVCaptureDevice.authorizationStatusForMediaType('vide')
  console.log('authStatus:' + authStatus)
  if (authStatus == 3) {
    result = true
    console.log('相机权限已经开启')
  } else {
    console.log('相机权限没有开启')
  }
  plus.ios.deleteObject(AVCaptureDevice)
  return result
}

// 判断相册权限是否开启
function judgeIosPermissionPhotoLibrary() {
  let result = false
  const PHPhotoLibrary = plus.ios.import('PHPhotoLibrary')
  const authStatus = PHPhotoLibrary.authorizationStatus()
  console.log('authStatus:' + authStatus)
  if (authStatus == 3) {
    result = true
    console.log('相册权限已经开启')
  } else {
    console.log('相册权限没有开启')
  }
  plus.ios.deleteObject(PHPhotoLibrary)
  return result
}

// 判断通讯录权限是否开启
function judgeIosPermissionContact() {
  let result = false
  const CNContactStore = plus.ios.import('CNContactStore')
  const cnAuthStatus = CNContactStore.authorizationStatusForEntityType(0)
  if (cnAuthStatus == 3) {
    result = true
    console.log('通讯录权限已经开启')
  } else {
    console.log('通讯录权限没有开启')
  }
  plus.ios.deleteObject(CNContactStore)
  return result
}

// 判断日历权限是否开启
function judgeIosPermissionCalendar() {
  let result = false
  const EKEventStore = plus.ios.import('EKEventStore')
  const ekAuthStatus = EKEventStore.authorizationStatusForEntityType(0)
  if (ekAuthStatus == 3) {
    result = true
    console.log('日历权限已经开启')
  } else {
    console.log('日历权限没有开启')
  }
  plus.ios.deleteObject(EKEventStore)
  return result
}

// 判断备忘录权限是否开启
function judgeIosPermissionMemo() {
  let result = false
  const EKEventStore = plus.ios.import('EKEventStore')
  const ekAuthStatus = EKEventStore.authorizationStatusForEntityType(1)
  if (ekAuthStatus == 3) {
    result = true
    console.log('备忘录权限已经开启')
  } else {
    console.log('备忘录权限没有开启')
  }
  plus.ios.deleteObject(EKEventStore)
  return result
}

// Android权限查询
function requestAndroidPermission(permissionID) {
  return new Promise((resolve, reject) => {
    plus.android.requestPermissions(
      [permissionID], // 理论上支持多个权限同时查询，但实际上本函数封装只处理了一个权限的情况。有需要的可自行扩展封装
      function (resultObj) {
        let result = 0
        for (var i = 0; i < resultObj.granted.length; i++) {
          const grantedPermission = resultObj.granted[i]
          console.log('已获取的权限：' + grantedPermission)
          result = 1
        }
        for (var i = 0; i < resultObj.deniedPresent.length; i++) {
          const deniedPresentPermission = resultObj.deniedPresent[i]
          console.log('拒绝本次申请的权限：' + deniedPresentPermission)
          result = 0
        }
        for (var i = 0; i < resultObj.deniedAlways.length; i++) {
          const deniedAlwaysPermission = resultObj.deniedAlways[i]
          console.log('永久拒绝申请的权限：' + deniedAlwaysPermission)
          result = -1
        }
        resolve(result)
        // 若所需权限被拒绝,则打开APP设置界面,可以在APP设置界面打开相应权限
        // if (result != 1) {
        // gotoAppPermissionSetting()
        // }
      },
      function (error) {
        console.log('申请权限错误：' + error.code + ' = ' + error.message)
        resolve({
          code: error.code,
          message: error.message,
        })
      }
    )
  })
}

// 使用一个方法，根据参数判断权限
function judgeIosPermission(permissionID) {
  if (permissionID == 'location') {
    return judgeIosPermissionLocation()
  } else if (permissionID == 'camera') {
    return judgeIosPermissionCamera()
  } else if (permissionID == 'photoLibrary') {
    return judgeIosPermissionPhotoLibrary()
  } else if (permissionID == 'record') {
    return judgeIosPermissionRecord()
  } else if (permissionID == 'push') {
    return judgeIosPermissionPush()
  } else if (permissionID == 'contact') {
    return judgeIosPermissionContact()
  } else if (permissionID == 'calendar') {
    return judgeIosPermissionCalendar()
  } else if (permissionID == 'memo') {
    return judgeIosPermissionMemo()
  }
  return false
}

// 跳转到**应用**的权限页面
function gotoAppPermissionSetting() {
  if (isIos) {
    const UIApplication = plus.ios.import('UIApplication')
    const application2 = UIApplication.sharedApplication()
    const NSURL2 = plus.ios.import('NSURL')
    // var setting2 = NSURL2.URLWithString("prefs:root=LOCATION_SERVICES");
    const setting2 = NSURL2.URLWithString('app-settings:')
    application2.openURL(setting2)

    plus.ios.deleteObject(setting2)
    plus.ios.deleteObject(NSURL2)
    plus.ios.deleteObject(application2)
  } else {
    // console.log(plus.device.vendor);
    const Intent = plus.android.importClass('android.content.Intent')
    const Settings = plus.android.importClass('android.provider.Settings')
    const Uri = plus.android.importClass('android.net.Uri')
    const mainActivity = plus.android.runtimeMainActivity()
    const intent = new Intent()
    intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
    const uri = Uri.fromParts('package', mainActivity.getPackageName(), null)
    intent.setData(uri)
    mainActivity.startActivity(intent)
  }
}

// 检查系统的设备服务是否开启
// var checkSystemEnableLocation = async function () {
function checkSystemEnableLocation() {
  if (isIos) {
    var result = false
    const cllocationManger = plus.ios.import('CLLocationManager')
    var result = cllocationManger.locationServicesEnabled()
    console.log('系统定位开启:' + result)
    plus.ios.deleteObject(cllocationManger)
    return result
  } else {
    const context = plus.android.importClass('android.content.Context')
    const locationManager = plus.android.importClass('android.location.LocationManager')
    const main = plus.android.runtimeMainActivity()
    const mainSvr = main.getSystemService(context.LOCATION_SERVICE)
    var result = mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER)
    console.log('系统定位开启:' + result)
    return result
  }
}

module.exports = {
  judgeIosPermission: judgeIosPermission,
  requestAndroidPermission: requestAndroidPermission,
  checkSystemEnableLocation: checkSystemEnableLocation,
  gotoAppPermissionSetting: gotoAppPermissionSetting,
}
