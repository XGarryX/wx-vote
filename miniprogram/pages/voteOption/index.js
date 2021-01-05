import callFunction from '../../untils/callFunction'
import choiceMode from '../../untils/choiceMode'
import getGuid from '../../untils/getGuid'

// pages/singleChoice/index.js
Page({
  data: {
    title: '',
    description: '',
    optionList: [],
    isAnonymous: false,
    //isLimit: false,
    loading: true
  },

  handleAddOption() {
    this.setData({
      optionList: [...this.data.optionList, {
        id: String(Date.now()),
        option: ''
      }]
    })
  },

  handleMinusTap(e) {
    const { index } = e.currentTarget.dataset
    let optionList = this.data.optionList
    this.setData({
      optionList: [
        ...optionList.slice(0, index),
        ...optionList.slice(index + 1)
      ]
    })
  },

  handleOptionInput(e) {
    const { value } = e.detail
    const { index } = e.currentTarget.dataset
    let optionList = this.data.optionList
    this.setData({
      optionList: [
        ...optionList.slice(0, index),
        Object.assign({}, optionList[index], {
          option: value.trim()
        }),
        ...optionList.slice(index + 1)
      ]
    })
  },

  handleChange(e) {
    const { attr } = e.currentTarget.dataset
    const { value } = e.detail

    this.setData({
      [attr]: value
    })
  },

  // handleIsLimitChange(e) {
  //   let isLimit =  e.detail.value
  //   isLimit && wx.showModal({
  //     title: '限制传播',
  //     content: '开启后仅允许在一个群中进行投票',
  //     showCancel: false,
  //   })

  //   this.setData({
  //     isLimit
  //   })
  // },

  handleSubmit() {
    let _id = this.data._id || getGuid()
    let { title, description, optionList, due, isAnonymous, mode } = this.data
    //检查标题是否为空
    if(!(title = title.trim())) {
      wx.showModal({
        content: '标题不能为空',
        showCancel: false,
      })
      return
    }
    //检查是否有选项未填
    let unfilled = optionList.findIndex(item => !item.option.trim())
    if(unfilled != -1) {
      wx.showModal({
        content: `选项${unfilled + 1}不能为空`,
        showCancel: false,
      })
      return
    }
    //提交
    wx.showToast({
      title: '提交中',
      icon: 'loading',
      mask: true
    })
    callFunction('newVote', {
      _id,
      title,
      description,
      optionList,
      due,
      isAnonymous,
      //isLimit,
      mode
    }).then(res => {
      if(res !== false) {
        wx.hideToast()
        wx.redirectTo({
          url: `/pages/voting/index?voteid=${_id}`
        })
      }
    })
  },
  //获取投票设置
  async getVoteData(id) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true
    })
    let res = await callFunction('getVoteBaseInfo', {
      _id: id
    })
    if(res != false) {
      let { description, due, isAnonymous, mode, optionList, title } = res.data
      this.setData({
        _id: id,
        description,
        due,
        isAnonymous,
        //isLimit,
        mode,
        optionList,
        title,
        loading: false
      })
      wx.hideToast()
    }
  },

  init(mode) {
    //获取当前日期
    let date = new Date()
    let due = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    //初始两个选项
    let optionList = Array.from({length: 2}).map((_, index) => {
      return {
        id: String(Date.now() + index),
        option: ''
      }
    })
    
    this.setData({
      optionList,
      due,
      mode,
      loading: false
    })

    let title = mode == choiceMode.SINGLE ? '单选投票' : '多选投票'
    wx.setNavigationBarTitle({
      title
    })
  },

  onLoad({mode, id}) {
    //有传id代表编辑
    if(id) {
      this.getVoteData(id)
    } else {
      this.init(mode)
    }
  }
})