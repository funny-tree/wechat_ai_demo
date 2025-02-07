Page({
  data: {
    messages: [ // 初始化系统消息
      { role: "system", content: "你好" }
    ],
    inputText: "",
    scrollTop: 0
  },

  // 输入框内容变化
  onInput(e) {
    this.setData({ inputText: e.detail.value });
  },

  // 发送消息
  async sendMessage() {
    const inputText = this.data.inputText.trim();
    if (!inputText) return wx.showToast({ title: "内容不能为空", icon: "none" });

    // 添加用户消息
    const newMessages = [...this.data.messages, { role: "user", content: inputText }];
    this.setData({ 
      messages: newMessages,
      inputText: "",
      scrollTop: 99999 // 滚动到底部
    });

    // 调用 DeepSeek API
    try {
      const res = await new Promise((resolve, reject) => {
        wx.request({
          url: "https://api.deepseek.com/v1/chat/completions", // 注意这个 endpoint
          method: "POST",
          header: {
            "Content-Type": "application/json",
            "Authorization": "Bearer 替换这里，前面这个不要删" // 替换你的 key
          },
          data: {
            model: "deepseek-reasoner",
            messages: newMessages,
            stream: false
          },
          success: resolve,
          fail: reject
        });
      });

      // 处理响应
      if (res.statusCode === 200) {
        const aiResponse = res.data.choices[0].message.content;
        this.setData({
          messages: [...this.data.messages, { role: "assistant", content: aiResponse }],
          scrollTop: 99999
        });
      } else {
        throw new Error(`请求失败: ${res.data}`);
      }
    } catch (err) {
      console.error("API 调用错误:", err);
      wx.showToast({ title: "请求失败，请重试", icon: "none" });
    }
  }
});