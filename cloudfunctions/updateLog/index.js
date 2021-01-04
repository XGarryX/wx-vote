// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async ({_id, voteList}) => {
  const db = cloud.database()

  return db.collection('voteLog').doc(_id).update({
    data: {
      voteList
    }
  })
}