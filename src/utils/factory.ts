export function getLocationAuthorize() {
  return new Promise((resolve, reject) => {
    uni.authorize({
      scope: 'scope.userLocation',
      success: () => {
        resolve(true) // 允许授权
      },
      fail: () => {
        reject() // 拒绝授权
      },
    })
  })
}
//查看用户权限
export function getSetting() {
  return new Promise((resolve, reject) => {
    uni.getSetting({
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}

//打开用户设置
export function openSetting() {
  return new Promise((resolve, reject) => {
    uni.openSetting({
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}

//获取位置
export function getLocation() {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: 'gcj02',
      isHighAccuracy: false, // 开启高精度定位
      highAccuracyExpireTime: 3000,
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}

//查看位置
export function openLocation() {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: 'gcj02', //返回可以用于uni.openLocation的经纬度
      success: function (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        uni.openLocation({
          latitude: latitude,
          longitude: longitude,
          success: (data) => {
            resolve(data)
          },
          fail: (err) => {
            reject(err)
          },
        })
      },
    })
  })
}
