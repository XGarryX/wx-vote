// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async ({voteid}) => {
  const db = cloud.database()
  let { OPENID } = cloud.getWXContext()

  return db.collection('voteLog').field({
    _id: true,
    voteList: true
  }).where({
    voteid,
    _openid: OPENID
  }).get().then(res => {
    return {
      ...res,
      _openid: OPENID
    }
  })
}