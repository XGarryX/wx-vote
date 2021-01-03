// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async ({_id}, context) => {
  const db = cloud.database()
  return db.collection('voteList').doc(_id).get()
}