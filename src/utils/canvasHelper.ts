// eslint-disable-next-line @typescript-eslint/no-var-requires
const stackBlur = require('stackblur-canvas')

/**
 * 初始化画布
 * @param app
 * @param base
 * @param canvasId
 * @returns {Promise}
 */
const init = (app, base, canvasId) => {
  return new Promise((resolve) => {
    const device = app.getSystemInfo()
    const query = base.createSelectorQuery()
    query
      .select(canvasId)
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const dpr = device.pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)
        console.log('画布初始化完毕，画布宽：', canvas.width, '画布高：', canvas.height, '设备像素比：', dpr)
        resolve({ ctx, canvas })
      })
  })
}

/**
 * 绘制圆角矩形
 * @param ctx
 * @param {number} x 圆角矩形选区的左上角 x坐标
 * @param {number} y 圆角矩形选区的左上角 y坐标
 * @param {number} w 圆角矩形选区的宽度
 * @param {number} h 圆角矩形选区的高度
 * @param {number} r 圆角的半径
 * @param {string} f 填充颜色
 */
const drawRoundRect = (ctx, x, y, w, h, r, f) => {
  ctx.save()
  // 开始绘制
  ctx.beginPath()
  // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
  // 这里是使用 fill 还是 stroke都可以，二选一即可
  ctx.fillStyle = f
  // ctx.setStrokeStyle('transparent')
  // 左上角
  ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)

  // border-top
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.lineTo(x + w, y + r)
  // 右上角
  ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

  // border-right
  ctx.lineTo(x + w, y + h - r)
  ctx.lineTo(x + w - r, y + h)
  // 右下角
  ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

  // border-bottom
  ctx.lineTo(x + r, y + h)
  ctx.lineTo(x, y + h - r)
  // 左下角
  ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

  // border-left
  ctx.lineTo(x, y + r)
  ctx.lineTo(x + r, y)

  // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
  ctx.fill()
  // ctx.stroke()
  ctx.closePath()
  // 剪切
  //ctx.clip();
}

/**
 * 绘制圆形
 * @param ctx
 * @param circlePointX
 * @param circlePointY
 * @param radius
 * @param backgroundColor
 * @param save
 */
const drawCircle = (ctx, circlePointX, circlePointY, radius, backgroundColor, save = true) => {
  if (save) ctx.save()
  //ctx.save();
  ctx.beginPath()
  ctx.arc(circlePointX, circlePointY, radius, 0, 2 * Math.PI, false)
  ctx.fillStyle = backgroundColor
  ctx.fill()
  ctx.clip()
  //ctx.restore();
  if (save) ctx.restore()
}

/**
 * 绘制圆形白边图像
 * @param canvas
 * @param ctx 图像
 * @param imageUrl 图像
 * @param startPositionX x坐标
 * @param startPositionY y坐标
 * @param size 图像大小，除以2就是圆半径
 * @param borderWidth 边框宽度
 * @param borderColor 边框颜色
 * @returns {Promise<*>}
 * @private
 */
const drawCircleImage = (canvas, ctx, imageUrl, startPositionX, startPositionY, size, borderWidth, borderColor) => {
  return new Promise((resolve, reject) => {
    //叠加圆形的绘制，需要先保存一下原始环境，然后绘制完第一个圆形后恢复绘制环境，即ctx.restore();
    ctx.save()
    drawCircle(ctx, startPositionX + size / 2, startPositionY + size / 2, size / 2, borderColor, false)

    if (borderWidth) {
      drawCircle(ctx, startPositionX + size / 2, startPositionY + size / 2, size / 2 - borderWidth, borderColor, false)
    }
    drawImage(canvas, ctx, imageUrl, startPositionX, startPositionY, size, size, 0)
      .then((res) => {
        ctx.restore()
        resolve(res)
      })
      .catch((res) => {
        reject(res)
      })
  })
}

/**
 * 绘制高斯模糊效果的图像
 * @param canvas
 * @param ctx
 * @param imageUrl
 * @param startPositionX
 * @param startPositionY
 * @param width
 * @param height
 * @param blur
 * @returns {Promise}
 * @private
 */
const drawBlurImage = (canvas, ctx, imageUrl, startPositionX, startPositionY, width, height, blur) => {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: imageUrl, //服务器返回的图片地址
      success: function (res) {
        console.log('=>', res)
        const imgObj = canvas.createImage()
        imgObj.src = res.path
        imgObj.onload = async function (e) {
          console.log('=========>', imgObj.width, imgObj.height)
          ctx.save()
          ctx.beginPath()
          ctx.drawImage(imgObj, startPositionX, startPositionY, width, height)
          //提取图片信息
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

          //进行高斯模糊
          const gd = stackBlur.imageDataRGBA(imageData, 0, 0, canvas.width, canvas.height, blur)

          //绘制模糊图像
          ctx.putImageData(gd, 0, 0)

          ctx.restore()
          console.log('图片加载完毕：', e)
          resolve()
        }
      },
      fail: function (res) {
        console.log(res)
        reject(res)
      },
    })
  })
}

/**
 * 绘制文本
 * @param ctx
 * @param text
 * @param startPositionX
 * @param startPositionY
 * @param textAlign
 * @param fontSize
 * @param fontWeight
 * @param color
 * @param shadowColor 阴影颜色
 * @param shadowOffsetX 阴影水平偏移距离
 * @param shadowOffsetY 阴影垂直偏移距离
 * @param shadowBlur 模糊程度
 * @param letterSpace 间隔
 * @returns {number}
 * @private
 */
const drawText = (
  ctx,
  text,
  startPositionX,
  startPositionY,
  textAlign,
  fontSize,
  fontWeight,
  fontFamily,
  color,
  shadowColor,
  shadowOffsetX,
  shadowOffsetY,
  shadowBlur,
  letterSpace = 0
) => {
  if (!text) {
    return 0
  }
  let textWidth = 0
  ctx.save()
  ctx.beginPath()
  ctx.fillStyle = color
  ctx.textAlign = textAlign
  ctx.font = fontWeight + ' ' + fontSize + 'px ' + fontFamily

  if (shadowColor) {
    console.log('设置阴影：', shadowColor)
    // 设置阴影
    ctx.shadowColor = shadowColor //阴影颜色
    ctx.shadowOffsetX = shadowOffsetX //偏移
    ctx.shadowOffsetY = shadowOffsetY
    ctx.shadowBlur = shadowBlur //模糊程度
  }

  if (!letterSpace) {
    const metrics = ctx.measureText(text)
    console.log('文字[' + text + ']宽度：', metrics.width)
    ctx.fillText(text, startPositionX, startPositionY)
    textWidth = metrics.width
  } else {
    //对齐方式调整为left
    ctx.textAlign = 'left'
    const positionXArr = [] //坐标集合
    textWidth = ctx.measureText(text).width + (text.length - 1) * letterSpace //含letterSpace的文字总宽度
    for (let i = 0; i < text.length; i++) {
      if (i === 0) {
        switch (textAlign) {
          case 'left':
            positionXArr.push(startPositionX)
            break
          case 'center':
            positionXArr.push(startPositionX - textWidth / 2)
            break
          case 'right':
            positionXArr.push(startPositionX - textWidth)
            break
          default:
            console.warn('暂不支持的textAlign：', textAlign)
            break
        }
      } else {
        const metrics = ctx.measureText(text[i - 1])
        positionXArr.push(positionXArr[i - 1] + metrics.width + letterSpace)
      }
    }
    for (let i = 0; i < text.length; i++) {
      ctx.fillText(text[i], positionXArr[i], startPositionY)
    }
  }

  ctx.restore()
  return textWidth
}

/**
 * 绘制图图像
 * @param canvas
 * @param ctx
 * @param startPositionX
 * @param startPositionY
 * @param width
 * @param height
 * @param blur
 * @param imageUrl
 * @returns {Promise}
 * @private
 */
const drawImage = (canvas, ctx, imageUrl, startPositionX, startPositionY, width, height, blur) => {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: imageUrl, //服务器返回的图片地址
      success: function (res) {
        console.log('=>', res)
        const imgObj = canvas.createImage()
        imgObj.src = res.path
        imgObj.onload = function (e) {
          ctx.save()
          ctx.beginPath()
          ctx.filter = 'blur(' + blur + 'px)'
          // ctx.globalAlpha = 0.6
          ctx.drawImage(imgObj, startPositionX, startPositionY, width, height)
          ctx.restore()
          console.log('图片加载完毕：', e)
          resolve(res)
        }
      },
      fail: function (res) {
        console.log(res)
        reject(res)
      },
    })
  })
}

/**
 * 将画布内容保存为图片
 * @param base
 * @param canvas
 * @param x
 * @param y
 * @param width
 * @param height
 * @param destWidth
 * @param destHeight
 * @param quality
 * @param fileType
 * @returns {Promise}
 */
const saveImage = (base, canvas, x, y, width, height, destWidth, destHeight, quality = 1, fileType = 'png') => {
  return new Promise((resolve, reject) => {
    wx.canvasToTempFilePath(
      {
        x,
        y,
        width,
        height,
        destWidth,
        destHeight,
        quality,
        fileType,
        canvas,
        success(res) {
          console.log(res.tempFilePath)
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: (res) => {
              resolve(res)
            },
            fail: (err) => {
              console.error(err)
              reject(err)
            },
          })
        },
        fail(res) {
          console.error('保存失败：', JSON.stringify(res))
          reject(res)
        },
      },
      base
    )
  })
}

module.exports = {
  init,
  drawCircle,
  drawCircleImage,
  drawImage,
  drawBlurImage,
  drawText,
  drawRoundRect,
  saveImage,
}
