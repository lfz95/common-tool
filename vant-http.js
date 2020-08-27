/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from 'axios';
// import QS from 'qs';
import { Toast } from 'vant';
// import store from '../store/index'
// let baseURL = sessionStorage.getItem('baseURL') || ''
//     // 环境的切换
// if (process.env.NODE_ENV == 'development') {
//     baseURL = '/api';
// } else if (process.env.NODE_ENV == 'production') {
//     baseURL = 'https://www.vzoom.com/auth-web';
// }

// 请求超时时间
axios.defaults.timeout = 80000;

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/json';
let requestRecord = {}

// 请求拦截器
axios.interceptors.request.use(

    config => {
        console.log(config)
        requestRecord[config.method + '-' + config.url] = JSON.stringify(config.data)
        if (config.showLoading) {
            Toast.loading({
                duration: 0, // 持续展示 toast
                forbidClick: true,
                loadingType: 'spinner',
                message: '请稍后...'
            });
        }
        // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
        // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
        // const token = store.state.token;
        // token && (config.headers.Authorization = token);
        if (!config.headers.Cookie && sessionStorage.getItem('sessionId') && sessionStorage.getItem('sessionId') != 'undefined') {
            // config.headers.Cookie = sessionStorage.getItem('sessionId')
            document.cookie = sessionStorage.getItem('sessionId')
        }
        if (!config.headers.web_token) {
            config.headers['web-token'] = sessionStorage.getItem('sessionId')
        }
        config.headers['web-type'] = sessionStorage.getItem('web_type')
        return config;
    },
    error => {
        return Promise.error(error);
    })

// 响应拦截器
axios.interceptors.response.use(
    response => {
        delete requestRecord[response.config.method + '-' + response.config.url]
        if (Object.keys(requestRecord).length == 0) {
            Toast.clear()
        }
        if (response.status === 200) {
            // return Promise.resolve(response);
            console.log(response)
            if (response && response.data && response.data.systemCode == 200) {
                if (response.data.head.businessCode == '0') {
                    return Promise.resolve(response.data.body);
                } else {
                    Toast({
                        message: response.data.head.businessMessage,
                        duration: 2500,
                        forbidClick: true
                    });
                    return Promise.reject(response.data.head.businessMessage);
                }

            } else {
                Toast({
                    message: '服务器响应失败',
                    duration: 2500,
                    forbidClick: true
                });
                Promise.reject(response)
            }
        } else {
            return Promise.reject(response);
        }
    },
    // 服务器状态码不是200的情况    
    error => {
        requestRecord = {}
        Toast.clear()
        if (error.response && error.response.status) {
            switch (error.response.status) {

                // 404请求不存在                
                case 404:
                    Toast({
                        message: '网络请求不存在',
                        duration: 2500,
                        forbidClick: true
                    });
                    break;
                    // 其他错误，直接抛出错误提示                
                default:
                    Toast({
                        message: '服务器响应失败',
                        duration: 2500,
                        forbidClick: true
                    });
            }
            return Promise.reject(error.response);
        } else {
            return Promise.reject('服务器响应失败');
        }
    }
);
/** 
 * get方法，对应get请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function get(url, params, showLoading = true) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
                params: params
            }, {
                showLoading
            }).then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err)
            })
    });
}
/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function post(url, params, showLoading = true) {
    return new Promise((resolve, reject) => {
        axios.post(url, params, { showLoading: showLoading })
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err)
            })
    });
}
export default {
    get,
    post
}
