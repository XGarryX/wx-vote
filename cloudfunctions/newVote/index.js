// 新建投票
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = (event, context) => {
  const db = cloud.database()

  const { _id, title, description, optionList, due, isAnonymous, isLimit, mode } = event
  const { OPENID } = cloud.getWXContext()

  return db.collection('voteList').doc(_id).set({
    _openid: OPENID,
    title, description, optionList, due, isAnonymous, isLimit, mode
  })
}