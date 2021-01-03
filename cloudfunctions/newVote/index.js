// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = (event, context) => {
  const db = cloud.database()

  const { _id, title, description, optionList, due, isAnonymous, isLimit, mode } = event
  const { OPENID } = cloud.getWXContext()

  return db.collection('voteList').add({
    data: {
      _id,
      _openid: OPENID,
      title, description, optionList, due, isAnonymous, isLimit, mode
    }
  })
}