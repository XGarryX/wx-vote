// miniprogram/pages/index/index.js
Page({
    data: {
        disabled: false
    },

    animationList: [{
        delay: 20,
        animations: 'translateY:-90%'
    }, {
        delay: 0,
        duration: 400,
        animations: 'translateY:-100%'
    }, {
        delay: 40,
        animations: 'translateY:-80%'
    }],

    handleanimationStart() {
        console.log('开始')
        this.setData({
            disabled: true
        })
    },

    handleAnimationEnd() {
        console.log('结束')
        this.setData({
            disabled: false
        })
    }
})