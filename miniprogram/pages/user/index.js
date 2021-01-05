import callFunction from '../../untils/callFunction'

Page({
  data: {
    hasLogin: true,
    voteList: [],
    padding: true,
    activeIndex: null
  },
  //获取我的投票
  getVotingRecord() {
    this.setData({
      padding: true
    })
    return callFunction('getMyVote')
      .then(res => {
        this.setData({
          padding: false
        })
        if(res !== false) {
          this.setData({
            voteList: res.list
          })
        }
      })
  },

  handleGetuserInfo(e) {
    let userInfo = e.detail.userInfo
    if(userInfo) {
      wx.setStorageSync('userInfo', userInfo)
      this.getVotingRecord()
      this.setData({
        hasLogin: true
      })
    }
  },

  handleVoteListTap(e) {
    const { index } = e.currentTarget.dataset
    let activeIndex = this.data.activeIndex
    
    activeIndex = activeIndex == index ? null : index

    this.setData({
      activeIndex
    })
  },
  //点击编辑按钮
  handleEdit(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/voteOption/index?id=${id}`
    })

    this.setData({
      activeIndex: null
    })
  },
  //点击查看按钮
  handleCheck(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/voting/index?voteid=${id}`
    })

    this.setData({
      activeIndex: null
    })
  },
  //点击删除按钮
  handleDelete(e) {
    const { id, index } = e.currentTarget.dataset
    wx.showModal({
      content: '确定要删除吗',
      success: () => {
        wx.showToast({
          title: '删除中',
          icon: 'loading',
          mask: true
        })
        callFunction('deleteVote', {
          id
        }).then(() => {
          let voteList = this.data.voteList
          wx.hideToast()
          this.setData({
            voteList: [
              ...voteList.slice(0, index),
              ...voteList.slice(index + 1)
            ]
          })
        })
      }
    })
  },
  onLoad: function () {
    let hasLogin = wx.getStorageSync('userInfo') ? true : false
    
    this.setData({
      hasLogin
    })
  },

  onShow() {
    if(this.data.hasLogin) {
      this.getVotingRecord()
    }
  },

  onShareAppMessage(e) {
    let title = '小投票'
    let path = '/pages/index/index'

    if(e.target) {
      const { id } = e.target.dataset
      const { nickName } = wx.getStorageSync('userInfo')

      title = `${nickName}给您发来一个投票`
      path = `/pages/voting/index?voteid=${id}`
    }
    return {
        title,
        path,
        imageUrl: '/assets/images/single-choice.png'
    }
  }
})