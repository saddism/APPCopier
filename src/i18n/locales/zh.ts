export default {
  nav: {
    appTitle: 'APP 复制器',
    home: '首页',
    upload: '上传',
    login: '登录',
    dashboard: '控制台',
    products: '产品',
    productDetail: '产品详情'
  },
  message: {
    hello: '你好',
    upload: {
      title: '视频上传',
      select: '选择视频',
      tip: '点击选择视频',
      error: {
        tooLarge: '文件大小不能超过500MB',
        invalidType: '请选择视频文件',
        uploadFailed: '上传失败，请重试',
        ios: {
          tooLarge: 'iOS设备上传文件不能超过300MB',
          iosSizeLimit: 'iOS设备上传限制为300MB',
          uploadFailed: 'iOS设备上传失败，请尝试使用更小的文件或其他设备',
          selection: 'iOS设备选择视频失败，请重试',
          format: '此视频格式在iOS上不受支持，请使用MP4格式',
          safari: 'Safari浏览器对视频上传支持有限，请尝试使用其他浏览器'
        }
      },
      uploading: '上传中...',
      success: '上传成功',
      start: '开始上传',
      cancel: '取消上传'
    },
    auth: {
      login: '登录',
      register: {
        title: '注册',
        emailPlaceholder: '请输入邮箱',
        codePlaceholder: '请输入验证码',
        passwordPlaceholder: '请输入密码',
        confirmPasswordPlaceholder: '请确认密码',
        sendCode: '发送验证码',
        codeSent: '验证码已发送',
        submit: '注册',
        loginLink: '已有账号？登录',
        emailRequired: '请输入邮箱',
        allFieldsRequired: '请填写所有字段',
        passwordMismatch: '两次输入的密码不一致',
        invalidCode: '验证码无效或已过期',
        sendCodeError: '发送验证码失败',
        success: '注册成功',
        error: '注册失败，请重试'
      },
      email: '邮箱',
      password: '密码',
      submit: '提交',
      forgotPassword: '忘记密码',
      noAccount: '没有账号？注册',
      hasAccount: '已有账号？登录',
      loginRequired: '请登录后使用此功能',
      errors: {
        'auth/invalid-email': '无效的邮箱地址',
        'auth/user-disabled': '该账号已被禁用',
        'auth/user-not-found': '用户不存在',
        'auth/wrong-password': '密码错误',
        'auth/email-already-in-use': '该邮箱已被注册',
        'auth/operation-not-allowed': '操作不被允许',
        'auth/weak-password': '密码强度太弱',
        'auth/network-request-failed': '网络请求失败',
        'auth/too-many-requests': '请求次数过多，请稍后再试',
        'auth/requires-recent-login': '需要重新登录'
      }
    },
    products: {
      title: '产品列表',
      detail: '产品详情',
      search: '搜索产品',
      noResults: '暂无产品',
      price: '价格',
      description: '描述',
      category: '分类',
      addToCart: '加入购物车'
    },
    common: {
      loading: '加载中...',
      error: '出错了',
      retry: '重试',
      switchLang: '切换语言',
      confirm: '确认',
      cancel: '取消',
      save: '保存',
      delete: '删除',
      edit: '编辑'
    }
  }
}
