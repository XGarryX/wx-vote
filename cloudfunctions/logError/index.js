// 记录错误信息
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const { errCode, errMsg } = event

  db.collection('ErrorLog').add({
    data: {
      errCode, errMsg
    }
  })
}