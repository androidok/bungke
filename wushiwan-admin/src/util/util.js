/**
 * @Author: leemon
 * @Date: 2019-04-22 09:55
 * @Description:
 */
export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? "早上好" : (hour <= 11 ? "上午好" : (hour <= 13 ? "中午好" : (hour < 20 ? "下午好" : "晚上好")))
}

export function welcome () {
  const arr = ["休息一会儿吧", "准备吃什么呢?", "要不要打一把 DOTA", "我猜你可能累了"]
  let index = Math.floor((Math.random() * arr.length))
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent () {
  let event = document.createEvent("HTMLEvents")
  event.initEvent("resize", true, true)
  event.eventType = "message"
  window.dispatchEvent(event)
}

/**
 * 过滤对象中为空的属性
 * @param obj
 * @returns {*}
 */
export function filterObj (obj) {
  if (!(typeof obj === "object")) {
    return
  }

  for (let key in obj) {
    if (obj.hasOwnProperty(key) &&
      (obj[key] == null || obj[key] === undefined || obj[key] === "")) {
      delete obj[key]
    }
  }
  return obj
}

/**
 * 时间格式化
 * @param value
 * @param fmt
 * @returns {*}
 */
export function formatDate (value, fmt) {
  var regPos = /^\d+(\.\d+)?$/
  if (regPos.test(value)) {
    // 如果是数字
    let getDate = new Date(value)
    let o = {
      "M+": getDate.getMonth() + 1,
      "d+": getDate.getDate(),
      "h+": getDate.getHours(),
      "m+": getDate.getMinutes(),
      "s+": getDate.getSeconds(),
      "q+": Math.floor((getDate.getMonth() + 3) / 3),
      "S": getDate.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + "").substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
      }
    }
    return fmt
  } else {
    value = value.trim()
    return value.substr(0, fmt.length)
  }
}

// 生成首页路由
export function generateIndexRouter (data) {
  return [{
    path: "/",
    component: () => import("@/components/Layout/Layout"),
    children: [
      ...generateChild(data)
    ]
  }, {
    "path": "*", "redirect": "/404"
  }]
}

function generateChild (data, parentPath = "") {
  let allRouters = []
  for (let item of data) {
    if (item.children && item.children.length > 0) {
      let currentPath = parentPath
      if (item.href) {
        currentPath += item.href
      }
      allRouters = allRouters.concat(generateChild(item.children, currentPath))
    } else {
      let component = ""
      if (item.component) {
        if (item.component.indexOf("layouts") >= 0) {
          component = "components/" + item.component
        } else {
          component = "views/" + item.component
        }
      } else {
        continue
      }

      let menu = {
        path: parentPath + item.href,
        name: item.componentName,
        component: () => import("@/" + component + ".vue"),
        meta: {
          hidden: !item.isShow,
          title: item.name,
          icon: item.icon,
          id: item.id.toString()
        }
      }
      allRouters.push(menu)
    }
  }
  return allRouters
}

// 生成嵌套路由（子路由）

function generateChildRouters (data) {
  const routers = []
  for (let item of data) {
    let component = ""
    if (item.component) {
      if (item.component.indexOf("layouts") >= 0) {
        component = "components/" + item.component
      } else {
        component = "views/" + item.component
      }
    } else {
      component = ""
    }

    let menu = {
      path: item.path,
      name: item.name,
      id: item.id,
      redirect: item.redirect,
      // component: () => {
      //   return import("@/" + component + ".vue")
      // },
      hidden: item.hidden,
      // component:()=> import(`@/views/${item.component}.vue`),
      meta: {
        title: item.meta.title,
        icon: item.meta.icon,
        url: item.meta.url,
        permissionList: item.meta.permissionList
      }
    }
    if (item.alwaysShow) {
      menu.alwaysShow = true
    }
    if (item.children && item.children.length > 0) {
      menu.children = [...generateChildRouters(item.children)]
    }
    if (component) {
      menu.component = () => { import("@/" + component + ".vue") }
    }
    routers.push(menu)
  }
  return routers
}
