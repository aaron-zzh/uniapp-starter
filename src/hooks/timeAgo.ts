import { UseTimeAgoMessages } from '@vueuse/core'

const messages = {
  justNow: '刚刚',
  past: (n: string) => (n.match(/\d/) ? `${n} 前` : n),
  future: (n: string) => (n.match(/\d/) ? `将于 ${n}` : n),
  month: (n: number, past: boolean) => (n == 1 ? (past ? '上个月' : '下个月') : `${n} 月`),
  year: (n: number, past: boolean) => (n == 1 ? (past ? '去年' : '明年') : `${n} 年`),
  day: (n: number, past: boolean) => (n == 1 ? (past ? 'yesterday' : 'tomorrow') : `${n} 天`),
  week: (n: number, past: boolean) => (n == 1 ? (past ? '上周' : '下周') : `${n} 周`),
  hour: (n: number) => `${n} 小时`,
  minute: (n: number) => `${n} 分钟`,
  second: (n: number) => `${n} 秒`,
  invalid: '无效',
} as UseTimeAgoMessages

export default function timeAgo(time: string) {
  return useTimeAgo(time, { messages })
}
