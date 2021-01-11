export function FormatDate(d, fmt) {
  if (!d) return ''
  const date = new Date(d)
  if (typeof (fmt) === 'undefined') {
    fmt = 'yyyy-MM-dd hh:mm:ss'
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : ('00' + str).substr(str.length))
    }
  }
  return fmt
}

export function FormatDate2(value) {
  if (value == null) {
    return ''
  } else {
    const date = new Date(value)
    const y = date.getFullYear() // 年
    let MM = date.getMonth() + 1 // 月
    MM = MM < 10 ? ('0' + MM) : MM
    let d = date.getDate() // 日
    d = d < 10 ? ('0' + d) : d
    let h = date.getHours() // 时
    h = h < 10 ? ('0' + h) : h
    let m = date.getMinutes() // 分
    m = m < 10 ? ('0' + m) : m
    let s = date.getSeconds() // 秒
    s = s < 10 ? ('0' + s) : s
    return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
  }
}
