/**
 *  封装网络请求的方法，对uni.request的封装
 */
import {BASEURL} from './baseurl'
const fetch = ({url,method='GET',data,header={},tips='正在拼命加载中',isNeedAuth=true})=>{
    // 对token进行处理

    return new Promise((resolve,reject)=>{
        uni.showLoading({
            title: tips
        });

        // 异步请求
        uni.request({
            method,
            url: `${BASEURL}${url}`, //仅为示例，并非真实接口地址。
            data:data,
            header:header,
            success: (res) => {
                resolve(res)
            },
            fail:err=>{
                reject(err)
            },
            complete:()=>{
                uni.hideLoading();
            }
        });
    })
}
// 按需导出
export {fetch}