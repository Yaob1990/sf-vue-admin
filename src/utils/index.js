/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * / _ - 转换成驼峰并将view替换成空字符串
 * @param {*} name name
 */
export function toHump(name) {
  return name
    .replace(/[\-\/\_](\w)/g, function(all, letter) {
      return letter.toUpperCase()
    })
    .replace('views', '')
}

/**
 * 驼峰转下划线
 * @param {*} name name
 */
export function toLine(name) {
  return name.replace(/([A-Z])/g, '_$1').toLowerCase()
}

export function getFileExtension(filename) {
  return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined
}
/**
 * 将文件文件名转为文件类型后缀
 * @param {string} fileName mime type
 * @returns svg icon name
 */
export function parseMimeTypeToIconName(fileName) {
  if (!fileName) {
    return 'file-type-unknown'
  }
  const ext = getFileExtension(fileName).toLowerCase()
  if (!ext) {
    return 'file-type-unknown'
  }
  if (['png', 'jpg', 'jpeg', 'ico', 'gif', 'bmp', 'webp'].includes(ext)) {
    return 'file-type-img'
  }
  if (['markdown', 'md', 'txt'].includes(ext)) {
    return 'file-type-txt'
  }
  if (['docx', 'doc', 'docm', 'dot', 'dotx'].includes(ext)) {
    return 'file-type-docx'
  }
  if (['csv', 'xls', 'xlsb', 'xlsm', 'xlsx', 'xltx'].includes(ext)) {
    return 'file-type-excel'
  }
  if (ext === 'pdf') {
    return 'file-type-pdf'
  }
  if (['pptx', 'ppt', 'pptm'].includes(ext)) {
    return 'file-type-ppt'
  }
  if (['zip', 'rar', '7z', 'tar', 'gz', 'tgz', 'tar.gz', 'tar.xz'].includes(ext)) {
    return 'file-type-zip'
  }
  if (['mp4', 'avi', 'wmv', 'rmvb', '3gp', 'mov', 'm4v', 'flv', 'mkv'].includes(ext)) {
    return 'file-type-video'
  }
  if (['mp3', 'wav'].includes(ext)) {
    return 'file-type-music'
  }
  if (['vue', 'js', 'go', 'java', 'ts', 'css', 'html', 'php', 'c', 'cpp', 'swift', 'kt'].includes(ext)) {
    return 'file-type-code'
  }
  return 'file-type-unknown'
}

/**
 *
 * byte to size
 * formatBytes(1024);       // 1 KB
 * formatBytes('1024');     // 1 KB
 * formatBytes(1234);       // 1.21 KB
 * formatBytes(1234, 3);    // 1.205 KB
 * @param {number} bytes file size
 */
export function formatSizeUnits(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * print ansi
 */
export function printANSI() {
  console.log(`
  ####  ######         ##   #####  #    # # #    #
 #      #             #  #  #    # ##  ## # ##   #
  ####  #####  ##### #    # #    # # ## # # # #  #
      # #            ###### #    # #    # # #  # #
 #    # #            #    # #    # #    # # #   ##
  ####  #            #    # #####  #    # # #    #
`)
}
