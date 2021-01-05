// 修改投票内容
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async ({ id, description, due, isAnonymous, isLimit, optionList, title }) => {
  const db = cloud.database()

  return db.collection('voteList').doc(id)
    .update({
      description,
      due,
      isAnonymous,
      isLimit,
      optionList,
      title
    })
}