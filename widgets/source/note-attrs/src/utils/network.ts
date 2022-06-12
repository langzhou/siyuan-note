import { Config } from "./../config/config"
import { ElMessage } from "element-plus"
import { API, RequestData, ResponseData } from "@/libs/Types"

/**
 * 封装思源 API 接口请求
 * @param requestType api 请求类型
 * @param requestData 请求返回数据
 * @param errorMessage 错误提示，不填时显示 error 信息
 */
export async function Siyuan(
  requestType: API,
  requestData: RequestData,
  errorMessage = ""
): Promise<ResponseData> {

  const requestInfor = Config.api.find((item: any) => item.type === requestType)

  return new Promise((resolve, reject) => {
    if (!requestInfor) {
      reject({
        code: -1,
        data: {},
        msg: `${requestType} 接口类型不存在`,
      })
    } else {
      request(Config.host + requestInfor.url, requestData)
        .then((res: ResponseData) => {
          if (res.code == 0) {
            resolve({
              code: 0,
              data: res.data,
              msg: "",
            })
          } else {
            ElMessage.error(errorMessage || '网络请求错误 [' + requestType + "]：" +  res.msg)
            resolve({
              code: -1,
              data: {},
              msg: res.msg,
            })
          }
        })
        .catch((err: Error) => {
          ElMessage.error(errorMessage || '网络请求错误 [' + requestType + "]：" + err.message)
          resolve({
            code: -1,
            data: {},
            msg: err.message,
          })
        })
    }
  })
}

// export async function setBlockAttrs(data: SetBlockAttrsRequest) {
//   return request(Config.host + "/api/attr/setBlockAttrs", data)
// }

// export function getBlockAttrs(data: GetBlockAttrsRequest) {
//   return request(Config.host + "/api/attr/getBlockAttrs", data)
// }

// export function insertBlock(data: any) {
//   return request(Config.host + "/api/block/insertBlock", data)
// }

// export function prependBlock(data: any) {
//   return request(Config.host + "/api/block/prependBlock", data)
// }

// export function appendBlock(data: any) {
//   return request(Config.host + "/api/block/appendBlock", data)
// }

// export function updateBlock(data: UpdateBlockRequest) {
//   return request(Config.host + "/api/block/updateBlock", data)
// }

// export function deleteBlock(data: any) {
//   return request(Config.host + "/api/block/deleteBlock", data)
// }

// export function querySQL(data: any) {
//   return request(Config.host + "/api/query/sql", data)
// }

// 将对象数据以 json 文件保存到本地
export function saveJSON(data: any, fileName: string) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([JSON.stringify(data)], {
      type: "text/json;charset=utf-8",
    })
    const form = new FormData()
    form.append("file", blob, "data.json")
    form.append("path", `/data/widgets/note-views/${fileName}.json`)
    form.append("isDir", "false")
    form.append("modTime", new Date().getTime().toString())
    fetch(Config.host + "/api/file/putFile", {
      method: "POST",
      body: form,
    })
      .then((res) => {
        res.json().then((json: any) => {
          if (json.code === 0) {
            resolve(true)
          } else {
            resolve(false)
            console.log("写入文件出错: ", json.msg)
          }
        })
      })
      .catch((err) => {
        resolve(false)
        console.log(err)
      })
  })
}

/**
 * 网络请求
 * @param url 请求地址
 * @param data
 * @param method post | get
 * @returns
 */
export function request(
  url: string,
  data: RequestData,
  method = "POST"
): Promise<ResponseData> {
  return new Promise((resolve, reject) => {
    if (method.toUpperCase() == "POST") {
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36",
        },
        body: JSON.stringify(data),
      })
        .then(handleResponse)
        .then((data: ResponseData) => resolve(data))
        .catch((error) => reject(error))
    } else {
      fetch(url, {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36",
        },
      })
        .then(handleResponse)
        .then((data: ResponseData) => resolve(data))
        .catch((error) => reject(error))
    }
  })

  function handleResponse(response: any) {
    const contentType = response.headers.get("content-type")
    if (contentType.includes("application/json")) {
      return handleJSONResponse(response)
    } else if (contentType.includes("text/html")) {
      return handleTextResponse(response)
    } else {
      throw new Error(`Sorry, content-type ${contentType} not supported`)
    }
  }

  function handleJSONResponse(response: any) {
    return response.json().then((json: any) => {
      if (response.ok) {
        return json
      } else {
        return Promise.reject(
          Object.assign({}, json, {
            status: response.status,
            statusText: response.statusText,
          })
        )
      }
    })
  }

  function handleTextResponse(response: any) {
    return response.text().then((text: any) => {
      if (response.ok) {
        return text
      } else {
        return Promise.reject({
          status: response.status,
          statusText: response.statusText,
          err: text,
        })
      }
    })
  }
}
