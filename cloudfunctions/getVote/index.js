// 获取投票设置信息、票数、投票人信息
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async ({_id}) => {
  const db = cloud.database()
  let { OPENID } = cloud.getWXContext()

  return db.collection('voteList')
    .aggregate().match({
    _id
    })
    .lookup({
      from: 'voteLog',
      localField: '_id',
      foreignField: 'voteid',
      as: 'voteLog'
    })
    .lookup({
      from: 'userInfo',
      localField: 'voteLog._openid',
      foreignField: '_id',
      as: 'userInfo'
    })
    .end().then(res => {
      return {
        ...res,
        _openid: OPENID
      }
    })
}