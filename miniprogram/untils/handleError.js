export default function handleError({errMsg, errCode}) {
    wx.hideToast()
    wx.cloud.callFunction({
      name: 'logError',
      data: {
        errMsg,
        errCode
      }
    })
    wx.showModal({
      title: '错误',
      content: `错误码:${errCode}`,
      showCancel: false,
    })
}