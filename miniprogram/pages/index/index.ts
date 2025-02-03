Page({
  data: {
    inputText: '', // 用户输入的内容
    responseText: '' // AI返回的内容
  },

  // 监听输入框内容变化
  onInput: function (e) {
    this.setData({
      inputText: e.detail.value
    });
  },

  // 发送消息给AI
  sendMessage: function () {
    const that = this;
    const inputText = this.data.inputText;

    // 检查输入是否为空
    if (!inputText) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      });
      return;
    }

    // 替换为你的API接口URL和API Key
    const apiUrl = 'https://api.moonshot.cn/v1/chat/completions'; // 你的API地址
    const apiKey = '你的key'; // 你的API Key

    // 发起网络请求
    wx.request({
      url: apiUrl,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}` // 如果有API Key，放在这里
      },
      data: {
        message: inputText // 发送用户输入的内容
      },
      success: function (res) {
        if (res.statusCode === 200) {
          // 请求成功，更新响应内容
          that.setData({
            responseText: res.data.response // 假设API返回的数据中有response字段
          });
        } else {
          // 请求失败，提示用户
          wx.showToast({
            title: '请求失败，请重试',
            icon: 'none'
          });
        }
      },
      fail: function (err) {
        // 网络错误，提示用户
        wx.showToast({
          title: '网络错误，请检查连接',
          icon: 'none'
        });
      }
    });
  }
});