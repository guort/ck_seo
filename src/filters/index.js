// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from '@/utils'

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function FormatDate(date, fmt) {
  if (!date) {
    return
  }
  if (date.length === 10) {
    date = Number(date) * 1000
  }
  date = new Date(date)
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
    if (value.length === 10) {
      value = Number(value) * 1000
    }
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

export function formatPrice(price) {
  let temp = ''
  const priceJson = JSON.parse(price)
  for (const key in priceJson) {
    if (temp) {
      temp += ',' + priceJson[key][1]
    } else {
      temp = priceJson[key][1]
    }
  }
  return temp
}

export function formatTimes(time) {
  var hour = Math.floor(time / 3600).toString()
  var minute = Math.floor((time - hour * 3600) / 60).toString()
  var second = (time % 60).toString()
  return hour.padStart(2, '0') + ':' + minute.padStart(2, '0') + ':' + second.padStart(2, '0')
}
