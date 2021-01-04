// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async ({_id}) => {
  const db = cloud.database()
  const $ = db.command.aggregate

  return db.collection('voteList')
    .aggregate().match({
      _id: '1609655527486'
    })
    .lookup({
      from: 'voteLog',
      localField: '_id',
      foreignField: 'voteid',
      pipeline: $.pipeline()
        .project({
          voteid: 0
        })
        .done(),
      as: 'voteLog'
    })
    .lookup({
      from: 'userInfo',
      localField: '_openid',
      foreignField: '_id',
      pipeline: $.pipeline()
        .project({
          _id: 0
        })
        .done(),
      as: 'userInfo'
    })
    .project({
      _id: 0,
      voteid: 0
    })
    .end()
}