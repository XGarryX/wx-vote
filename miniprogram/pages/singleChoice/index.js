// pages/singleChoice/index.js
Page({
  data: {
    optionList: Array(2),
    isAnonymous: false,
    isLimit: false
  },

  handleAddOption() {
    this.setData({
      optionList: [...this.data.optionList, {
        id: Date.now(),
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

  handlePickDate(e) {
    let date = e.detail.value
    console.log(date)
    this.setData({
      date
    })
  },

  handleIsAnonymousChange(e) {
    this.setData({
      isAnonymous: e.detail.value
    })
  },

  handleIsLimitChange(e) {
    this.setData({
      isLimit: e.detail.value
    })
  },

  onLoad() {
    let date = new Date().toLocaleDateString().replace(/\//g, "-")

    this.setData({
      date
    })
  }
})