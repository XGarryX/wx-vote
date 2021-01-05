// 获取用户头像等信息
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async ({openid}, context) => {
  const db = cloud.database()
  const _ = db.command

  return db.collection('userInfo').where({
    _id: _.in(openid)
  }).get()
}