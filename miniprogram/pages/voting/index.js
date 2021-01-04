import callFunction from '../../untils/callFunction'
import choiceMode from '../../untils/choiceMode'
import getGuid from '../../untils/getGuid'

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
    isLoading: true
  },

  voteid: null,

  async getVoteData(voteid) {
    const res = await callFunction('getVote', {
      _id: voteid
    })
    console.log(res)
    if(res !== false) {
      let { title, description, optionList, mode, voteLog, userInfo } = res.list[0]
      let modeText = mode == choiceMode.SINGLE ? '单选' : '多选'

      this.setData({
        title,
        description,
        optionList,
        modeText,
        mode,
        _openid: res._openid
      })

      this.setVoteLog(voteLog)
      this.setUserInfo(userInfo)
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
          console.log(res)
          if(res.type != "init") {
            this.setVoteLog(res.docs)
            this.logUserInfo(res.docChanges)
          }
        },
        onError(err) {
          console.log(err)
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

    callFunction(fnName, param).then(res => {
      console.log('更新投票')
    })
  },
  //记录投票用户信息
  logUserInfo(changes) {
    let openid = []
    changes.forEach(log => {
      const { dataType, doc: _openid } = log
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
    let { optionid } = e.currentTarget.dataset
    let myVoteList = this.data.myVoteList
    let newVoteList = {...myVoteList}

    if(myVoteList[optionid]) {
      myVoteList[optionid].state = 'loading'
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

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad({voteid}) {
    this.voteid = voteid
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true
    })
    //获取投票内容
    await this.getVoteData(voteid)

    this.getVoteLogWatcher(voteid)

    wx.hideToast()

    this.setData({
      isLoading: false
    })
  }
})