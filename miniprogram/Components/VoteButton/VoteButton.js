// Components/AnimationHand/AnimationHand.js
Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    animationList: {
      type: Array,
      value: []
    },
    disabled: {
      type: Boolean,
      value: false
    },
    url: {
      type: String,
      value: ''
    }
  },

  data: {
    count: 3,
    resetting: false  //是否处于初始化状态
  },

  methods: {
    handleTap() {
      if(!this.data.disabled && !this.data.resetting) {
        let animationList = [{
          delay: 20,
          animations: 'translateY:-90%'
        }, {
            delay: 0,
            duration: 300,
            animations: 'translateY:-100%'
        }, {
            delay: 40,
            animations: 'translateY:-80%'
        }]

        this.setAnimationData(animationList)
        this.triggerEvent('animationStart')
      }
    },

    setAnimationData(animationList) {
      let animationData = animationList.map(({animations, ...attrs}) => {
        let animationObj = wx.createAnimation({
          transformOrigin: 'center bottom',
          duration: 200,
          timingFunction: 'cubic-bezier(.65,.29,.25,1.29)',
          ...attrs
        })

        return animations.split(',').reduce((animationObj, animation) => {
          let [fn, arg] = animation.split(':')
          return animationObj[fn](arg)
        }, animationObj).step()
      })

      this.setData({
          animationData
      })
    },
    
    reset() {
      let animationList = [{
        delay: 20,
        animations: 'translateY:0'
      }, {
          delay: 0,
          animations: 'translateY:0'
      }, {
          delay: 40,
          animations: 'translateY:0'
      }]

      this.setData({
        resetting: true
      })
      this.setAnimationData(animationList)
    },

    animationStart() {
      this.triggerEvent('animationStart')
    },

    handleTransitionEnd: (function() {
      let _complate = 0
      return function () {
        if(++_complate == this.data.count) {
          let url = this.data.url

          _complate = 0

          if(this.data.resetting) {
            this.setData({
              resetting: false
            })
          } else {
            url && wx.navigateTo({
              url
            })
            this.triggerEvent('animationEnd')
            this.reset()
          }
        }
      }
    })()
  },

})
