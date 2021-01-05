import callFunction from '../../untils/callFunction'
import choiceMode from '../../untils/choiceMode'
import getGuid from '../../untils/getGuid'
import handleError from '../../untils/handleError'

const paddingList = []
// pages/voting/index.js
Page({
  data: {
    _id: null, //投票纪录id
    mode: '',       //单选/多选
    title: '',      //标题
    description: '',//说明
    optionList: [], //选项列表
    voteLog: {},    //所有票数
    myVoteList: {}, //我的票数
    userInfo: {},   //用户姓名/头像
    isLoading: true,//是否加载数据中
    isOutDate: false//是否过截止日期
  },

  voteid: null,
  //获取投票信息
  async getVoteData(voteid) {
    const res = await callFunction('getVote', {
      _id: voteid
    })
    if(res !== false) {
      let { title, description, optionList, mode, voteLog, userInfo, isAnonymous, due } = res.list[0]
      let modeText = mode == choiceMode.SINGLE ? '单选' : '多选'

      this.setData({
        title,
        description,
        optionList,
        modeText,
        mode,
        due,
        isAnonymous,
        _openid: res._openid
      })

      this.isOutDate(due)
      this.setVoteLog(voteLog)
      this.setUserInfo(userInfo)
    }
  },
  //检查改投票是否过期
  isOutDate(due) {
    due = new Date(`${due} 24:00:00`).getTime()
    let now = new Date().getTime()

    if(now > due) {
      wx.showModal({
        title: '投票已结束',
        showCancel: false
      })
      this.setData({
        isOutDate: true
      })
    }
  },
  //监听票数变化
  async getVoteLogWatcher(voteid) {
    const db = wx.cloud.database()
    let watcher = db.collection('voteLog')
      .where({
        voteid
      })
      .watch({
        onChange: res => {
          this.setVoteLog(res.docs)
          this.logUserInfo(res.docChanges)
        },
        onError(err) {
          handleError(err)
        }
      })
    this.setData({
      watcher
    })
  },
  //处理所有票数
  setVoteLog(votes) {
    let voteLog = {
      total: 0
    }
    let myVoteList = {}
    votes.forEach(item => {
      const {_id, _openid, voteList} = item
      voteList.forEach(optionid => {
        let list = voteLog[optionid] = voteLog[optionid] || []
        list.push(_openid)
        voteLog.total++
        if(_openid == this.data._openid) {
          this.setData({
            _id
          })
          myVoteList[optionid] = {
            state: 'active'
          }
        }
      })
    })
    this.setData({
      voteLog,
      myVoteList
    })
  },
  //处理用户信息
  setUserInfo(userInfo) {
    let info = {}
    userInfo.forEach(({_id, nickName, avatarUrl}) => {
      info[_id] = {
        nickName,
        avatarUrl
      }
    })
    this.setData({
      userInfo: info
    })
  },
  //更新投票信息
  updateVoteLog(myVoteList) {
    myVoteList = Object.keys(myVoteList)
    let _id = this.data._id
    let param = {
      _id,
      voteList: myVoteList
    }
    let fnName = 'updateLog'

    if(this.data._id == null) {
      fnName = 'logVote'
      _id = getGuid()
      Object.assign(param, {
        _id,
        voteid: this.voteid
      })
    }

    this.setData({
      _id
    })

    callFunction(fnName, param)
  },
  //记录投票用户信息
  logUserInfo(changes) {
    let openid = []
    changes.forEach(log => {
      const { dataType, doc: { _openid } } = log
      if(dataType == "add" && !this.data.userInfo[_openid] && !paddingList.includes(_openid)) {
        paddingList.push(_openid)
        openid.push(_openid)
      }
    })
    callFunction('getUserInfo', {
      openid
    }).then(res => {
      if(res) {
        let userInfo = this.data.userInfo
        res.data.forEach(({_id, nickName, avatarUrl}) => {
          let index = paddingList.indexOf(_id)
          if(index != -1) {
            paddingList.splice(index, 1)
          }
          userInfo[_id] = {
            nickName,
            avatarUrl
          }
        })
      }
    })
  },
  handleOptionTab(e) {
    if(this.data.isOutDate) return
    let { optionid } = e.currentTarget.dataset
    let myVoteList = this.data.myVoteList
    let newVoteList = {...myVoteList}

    if(myVoteList[optionid]) {
      myVoteList[optionid].state = 'canceling'
      delete newVoteList[optionid]
    } else {
      if(this.data.mode == choiceMode.SINGLE) {
        myVoteList = {
          [optionid]: {
            state: 'loading'
          }
        }
        newVoteList = {
          [optionid]: true
        }
      } else {
        myVoteList[optionid] = {
          state: 'loading'
        }
        newVoteList[optionid] = true
      }
    }

    this.setData({
      myVoteList
    })
    this.updateVoteLog(newVoteList)
  },

  async onLoad(option) {
    let voteid = option.voteid
    this.voteid = voteid
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true
    })
    //获取投票内容
    await this.getVoteData(voteid)

    if(!this.data.isOutDate) {
      this.getVoteLogWatcher(voteid)
    }

    wx.hideToast()

    this.setData({
      isLoading: false
    })
  },

  onUnload() {
    let watcher = this.data.watcher
    watcher && watcher.close()
  },

  onShareAppMessage() {
    let { nickName } = wx.getStorageSync('userInfo')
    return {
        title: `${nickName}给您发来一个投票`,
        path: `/pages/voting/index?voteid=${this.voteid}`,
        imageUrl: '/assets/images/single-choice.png'
    }
  }
})