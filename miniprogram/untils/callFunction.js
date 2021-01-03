import handleError from './handleError'

export default function callFunction(name, data) {
    return wx.cloud.callFunction({
        name,
        data
    }).then(({result}) => {
        if(result && result.errCode){
            return Promise.reject(result)
        }
        return result
    }).catch(err => {
        handleError(err)
        return false
    })
}