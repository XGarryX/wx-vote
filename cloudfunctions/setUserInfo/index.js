// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async ({nickName, avatarUrl}) => {
  const db = cloud.database()
  const { OPENID } = cloud.getWXContext()

  return db.collection('userInfo').doc(OPENID).set({
    data: {
      nickName,
      avatarUrl
    }
  })
}