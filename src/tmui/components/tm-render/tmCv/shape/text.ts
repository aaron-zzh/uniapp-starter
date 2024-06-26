import { Shape } from '../shape'

export class tmTextLabel extends Shape {
  textHeight = 0
  private drawText(text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    if (typeof text != 'string' || typeof x != 'number' || typeof y != 'number') {
      return
    }

    const context = this.canvas.ctx

    // 字符分隔为数组
    const arrText = text.split('')
    let line = ''
    const _x = x
    let _x_t = _x
    let lines = 1
    for (let n = 0; n < arrText.length; n++) {
      const testLine = line + arrText[n]
      const metrics = context?.measureText(testLine) ?? 14
      const testWidth = metrics.width
      if (this.textAlign == 'center') {
        _x_t = x + (maxWidth - testWidth / 2) / 2 + this.fontSize
      }
      if (this.textAlign == 'right') {
        _x_t = maxWidth - x
      }
      if (testWidth > maxWidth && n > 0) {
        context?.fillText(line, _x_t, y)
        line = arrText[n]
        y += lineHeight
        lines++
      } else {
        line = testLine
      }
    }
    this.textHeight = lines * lineHeight
    context?.fillText(line, _x_t, y)
  }
  draw(): this {
    if (!this.canvas.ctx) return this
    const ctx = this.canvas.ctx
    const x = this.x
    const y = this.y
    const width = this.width
    const height = this.height
    const fillStyle = this.fillStyle
    const strokeStyle = this.strokeStyle
    const lineWidth = this.lineWidth

    const maxWidth = this.textMaxWidth || this.canvas.opts.width
    const text = this.text
    const letterSpace = this.letterSpace
    const fontSize = this.fontSize
    const lineHeight = fontSize * 1.5

    ctx.beginPath()

    if (ctx.setFillStyle) {
      ctx.setFillStyle(fillStyle)
      ctx.setLineWidth(lineWidth)
      ctx.setStrokeStyle(strokeStyle)
      ctx.setLineJoin(this.lineJoin)
      ctx.setLineDash(this.lineDash, this.lineDashOffset)
      ctx.setTextBaseline('top')
      ctx.setFontSize(fontSize)
      ctx.setTextAlign(this.textAlign)
    } else {
      ctx.fillStyle = fillStyle
      ctx.lineWidth = lineWidth
      ctx.strokeStyle = strokeStyle
      ctx.lineJoin = this.lineJoin
      ctx.setLineDash(this.lineDash, this.lineDashOffset)
      ctx.textBaseline = 'top'
      ctx.font = fontSize + 'px sans-serif'
      ctx.textAlign = this.textAlign
    }

    this.drawText(text, x, y, maxWidth, lineHeight)
    ctx.fill()
    ctx.stroke()

    return this
  }
}
