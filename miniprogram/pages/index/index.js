import choiceMode from '../../untils/choiceMode'
import callFunction from '../../untils/callFunction'

Page({
    data: {
        disabled: false,
        choiceMode: {},
        hasLogin: false
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
        this.setData({
            disabled: true
        })
    },

    handleAnimationEnd() {
        this.setData({
            disabled: false,
        })
    },

    handleLoginComplate(userInfo) {
        wx.setStorageSync('userInfo', userInfo)

        callFunction('setUserInfo', {
            nickName: userInfo.nickName,
            avatarUrl: userInfo.avatarUrl
        })

        this.setData({
            hasLogin: true
        })
    },

    onLoad() {
        let hasLogin = wx.getStorageSync('userInfo') ? true : false

        this.setData({
            choiceMode,
            hasLogin
        })
    },

    onShareAppMessage() {
        return {
            title: '小投票',
            path: '/pages/index/index',
            imageUrl: '/assets/images/single-choice.png'
        }
    }
})