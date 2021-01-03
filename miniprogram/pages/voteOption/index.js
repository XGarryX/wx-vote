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
    isLimit: false
  },

  option: 'single',

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

  handleIsLimitChange(e) {
    let isLimit =  e.detail.value
    isLimit && wx.showModal({
      title: '限制传播',
      content: '开启后仅允许在一个群中进行投票',
      showCancel: false,
    })

    this.setData({
      isLimit
    })
  },

  handleSubmit() {
    let _id = getGuid()
    let { title, description, optionList, due, isAnonymous, isLimit } = this.data
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
      isLimit,
      mode: this.mode
    }).then(res => {
      if(res !== false) {
        wx.hideToast()
        wx.redirectTo({
          url: `/pages/voting/index?voteid=${res._id}`
        })
        console.log(res)
      }
    })
  },

  onLoad({mode}) {
    let due = new Date().toLocaleDateString().replace(/\//g, "-")
    let optionList = Array.from({length: 2}).map((_, index) => {
      return {
        id: String(Date.now() + index),
        option: ''
      }
    })
    
    this.setData({
      optionList,
      due
    })

    let title = mode == choiceMode.SINGLE ? '单选投票' : '多选投票'

    wx.setNavigationBarTitle({
      title
    })

    this.mode = mode
  }
})