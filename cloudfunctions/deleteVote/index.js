// 删除创建的投票
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async ({id}) => {
  const db = cloud.database()

  return db.collection('voteList').doc(id).remove()
}