// 获取我创建的投票
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const $ = db.command.aggregate
  const { OPENID } = cloud.getWXContext()

  return db.collection('voteList').aggregate()
    .match({
      _openid: OPENID
    }).lookup({
      from: 'voteLog',
      localField: '_id',
      foreignField: 'voteid',
      as: 'voteList'
    })
    .project({
      _id: 1,
      title: 1,
      voteCount: $.size('$voteList')
    })
    .end()
}