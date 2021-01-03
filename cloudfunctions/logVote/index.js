// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async ({_id, voteid, voteList}) => {
  const db = cloud.database()
  let { OPENID } = cloud.getWXContext()

  return db.collection('voteLog').doc(_id).set({
    data: {
      _openid: OPENID,
      voteid,
      voteList
    }
  })
}