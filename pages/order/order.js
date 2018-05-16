import { OrderModel } from '../order/order-model.js'
import { Image } from '../../utils/image.js'
let order = new OrderModel()
let app = getApp()

Page({
  data: {
    order: [
      [], [], [], [], []
    ],
    hasMore: [true, true, true, true, true],
    loadingHidden: false,
    tabIndex: 0,
    page: [1, 1, 1, 1, 1]
  },

  onLoad: function (options) {    
    this.image = new Image(this)
    this.image.setLoadingHidden()   

    this._loadOrder()
  },

  onShow(){
    if (wx.getStorageSync('newOrder')) {
      this.reload(true)
      wx.setStorageSync('newOrder', false)
    }
  },

  onReachBottom() {
    let index = this.data.tabIndex
    if (this.data.hasMore[index]) {
      this.data.page[index]++
      this._loadOrder()
    }
  },

  reload(cb) {
    this.data.order = [
      [], [], [], [], []
    ],
    this.data.hasMore = [true, true, true, true, true],
    this.data.page = [1, 1, 1, 1, 1]

    this._loadOrder(cb)    
  },
  
  _loadOrder(cb) {
    let index = this.data.tabIndex
    let status = index
    if(index == 4){
      status = -2
    }
    order.getOrder(status, this.data.page[index], (res) => {
      this.image.addPhotosCount(res.length)
      this.data.order[index].push.apply(this.data.order[index], res)
      this.setData({
        order: this.data.order
      })
      cb && cb()
    }, (res) => {
      this.data.hasMore[index] = false
      this.setData({
        order: this.data.order,
        loadingHidden: true
      })
      cb && cb()
    })
  },

  isLoadedAll(event) {
    this.image.isLoadedAll()
  },

  switchTab(event) {
    let index = event.detail.index
    this.data.tabIndex = index
    if (this.data.order[index].length == 0) {
      this._loadOrder()
    }
  },

  onPullDownRefresh() {
    this.reload(() => {
      wx.stopPullDownRefresh()
    })
  }
})