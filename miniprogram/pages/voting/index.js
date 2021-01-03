import callFunction from '../../untils/callFunction'
import choiceMode from '../../untils/choiceMode'
import getGuid from '../../untils/getGuid'

// pages/voting/index.js
Page({
  data: {
    mode: '',
    voteData: {},
    voteLog: {},
    myVoteList: [],
    isLoading: true
  },

  voteid: null,

  async getVoteData(voteid) {
    const res = await callFunction('getVote', {
      _id: voteid
    })

    if(res !== false) {
      let data = res.data
      let modeText = data.mode == choiceMode.SINGLE ? '单选' : '多选'
      this.setData({
        voteData: data,
        modeText
      })
    }
  },

  async getMyVote(voteid) {
    const { data: [voteData] } = await callFunction('getMyVote', {
      voteid
    })
    //已有投票记录
    if(voteData) {
      this.setData({
        _id: voteData._id,
        myVoteList: voteData.voteList
      })
    } else {
      let _id = getGuid()
      this.setData({
        _id
      })
    }
  },

  handleOptionTab(e) {
    let { optionid } = e.currentTarget.dataset
    callFunction('logVote', {
      _id: this.data._id,
      voteid: this.voteid,
      voteList: [optionid]
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad({voteid}) {
    this.voteid = voteid
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true
    })
    Promise.all([
      //获取投票内容
      this.getVoteData(voteid),
      //获取我的投票
      this.getMyVote(voteid)
    ]).then(() => {
      wx.hideToast()
      this.setData({
        isLoading: false
      })
    })
  }
})