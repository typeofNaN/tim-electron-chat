const locale: I18nType.Schema = {
  system: {
    title: 'IM Electron Chat',
    updateApplication: '更新应用',
    notNeedUpdate: '当前版本已是最新版本，不需要更新！'
  },
  common: {
    success: '成功',
    fail: '失败',
    add: '添加',
    addSuccess: '添加成功',
    addFail: '添加失败',
    edit: '修改',
    editSuccess: '修改成功',
    editFail: '修改失败',
    delete: '删除',
    deleteSuccess: '删除成功',
    deleteFail: '删除失败',
    batchDelete: '批量删除',
    operationSuccess: '操作成功',
    operationFail: '操作失败',
    confirm: '确认',
    cancel: '取消',
    close: '关闭',
    reject: '拒绝',
    accept: '接受',
    pleaseCheckValue: '请检查输入的值是否合法',
    action: '操作',
    search: '搜索',
    pleaseInputSearchValue: '请输入搜索值',
    noData: '无数据',
    copy: {
      browserNotSupportedCopy: '您的浏览器不支持复制功能，请切换浏览器后重试！',
      copySuccess: '复制成功！',
      copyFail: '复制失败！'
    },
    yes: '是',
    no: '否',
    placeholder: {
      pleaseInput: '请输入',
      pleaseSelect: '请选择',
      pleaseUpload: '请上传'
    }
  },
  gender: {
    unknown: '未知',
    female: '女',
    male: '男'
  },
  chat: {
    send: '发送',
    emojis: '表情',
    sendImage: '发送图片',
    sendVideo: '发送视频',
    sendFile: '发送文件',
    chatHistory: '聊天记录',
    exitEditMode: '退出编辑模式',
    videoChat: '视频聊天',
    voiceCall: '语音通话',
    search: {
      _value: '搜索',
      contacts: '联系人',
      group: '群组',
      message: '消息'
    },
    edited: '已编辑',
    systemNotification: '系统通知'
  },
  msgPlaceholders: {
    image: '[图片]',
    sound: '[语音]',
    customMessage: '[自定义消息]',
    personalCard: '[个人名片]',
    file: '[文件]',
    location: '[位置]',
    video: '[视频]',
    friendApply: '[好友申请]',
    chatHistory: '[聊天记录]',
    personalCenter: '[个人中心]',
    photoGroup: '[图组]',
    friendOnlineNotification: '[好友上线通知]'
  },
  msgNotification: {
    sendAMessageToYou: '给你发了一条消息',
    image: '图片',
    sound: '语音',
    customMessage: '自定义消息',
    file: '文件',
    video: '视频',
    inviteVideoChat: '{ userName }邀请你视频聊天',
    inviteVoiceChat: '{ userName }邀请你语音聊天'
  },
  app: {
    ctrl: {
      fullScreen: '全屏',
      exitFullScreen: '退出全屏',
      dragMove: '拖拽移动',
      topUp: '置顶',
      minimize: '最小化',
      maximize: '最大化',
      unMaximize: '取消最大化',
      restore: '还原',
      exitApp: '关闭应用'
    },
    exit: {
      title: '关闭应用',
      content: '您确定要关闭应用吗？',
      confirm: '确认',
      cancel: '取消',
      miniSize: '最小化'
    }
  },
  tip: {
    tokenExpire: 'Token已失效，请重新登录',
    toAppLook: '当前功能未实现，请到APP中打开查看！'
  },
  tab: {
    contentMenu: {
      fullScreen: '内容全屏',
      reload: '重新加载',
      close: '关闭',
      closeOther: '关闭其他',
      closeLeft: '关闭左侧',
      closeRight: '关闭右侧',
      closeAll: '关闭所有'
    }
  },
  formValid: {
    notEmpty: '不能为空',
    enterUserName: '请输入用户名',
    enterPhoneNumber: '请输入手机号码',
    phoneNumberFormatError: '手机号码格式错误',
    enterPassword: '请输入密码',
    passwordFormatError: '密码为6-18位数字/字符/符号，至少2种组合',
    enterValidCode: '请输入验证码',
    validCodeFormatError: '验证码格式错误',
    validCodeError: '验证码不正确',
    enterEmail: '请输入邮箱',
    emailFormatError: '邮箱格式错误',
    enterConfirmPassword: '请输入确认密码',
    confirmPasswordError: '输入的值与密码不一致'
  },
  routes: {
    dashboard: {
      _value: '仪表盘',
      analysis: '分析页',
      workbench: '工作台'
    },
    document: {
      _value: '文档',
      vue: 'Vue文档',
      vite: 'Vite文档',
      naive: 'NaiveUI文档',
      project: '项目文档',
      'project-link': '项目文档(外链)'
    },
    component: {
      _value: '组件示例',
      button: '按钮',
      card: '卡片',
      table: '表格'
    },
    plugin: {
      _value: '插件示例',
      charts: {
        _value: '图表',
        echarts: 'ECharts',
        antv: 'AntV'
      },
      copy: '剪贴板',
      editor: {
        _value: '编辑器',
        quill: '富文本',
        markdown: 'Markdown'
      },
      icon: '图标',
      map: '地图',
      print: '打印',
      swiper: 'Swiper',
      video: '视频'
    },
    'auth-demo': {
      _value: '权限示例',
      permission: '切换权限',
      super: '超级管理员可见'
    },
    function: {
      _value: '功能',
      tab: 'Tab页签'
    },
    exception: {
      _value: '异常页',
      403: '403',
      404: '404',
      500: '500'
    },
    home: {
      _value: '首页'
    },
    contacts: {
      _value: '联系人'
    },
    setting: {
      _value: '设置'
    },
    callChat: {
      _value: '音视频通话'
    },
    mediaPreview: {
      _value: '媒体预览'
    },
    management: {
      _value: '系统管理',
      auth: '权限管理',
      role: '角色管理',
      route: '路由管理',
      user: '用户管理'
    },
    about: '关于'
  },
  layout: {
    userAvatar: {
      logout: '退出登录',
      tip: '提示',
      askLogout: '您确定要退出登录吗？'
    },
    settingDrawer: {
      title: '主题配置',
      themeModeTitle: '主题模式',
      darkMode: '深色主题',
      layoutModelTitle: '布局模式',
      systemThemeTitle: '系统主题',
      pageFunctionsTitle: '界面功能',
      pageViewTitle: '界面显示',
      followSystemTheme: '跟随系统',
      isCustomizeDarkModeTransition: '自定义暗黑主题动画过渡',
      scrollMode: '滚动模式',
      scrollModeList: {
        wrapper: '外层滚动',
        content: '主体滚动'
      },
      fixedHeaderAndTab: '固定头部和多页签',
      header: {
        inverted: '头部深色',
        height: '头部高度',
        crumb: {
          visible: '面包屑',
          icon: '面包屑图标'
        }
      },
      tab: {
        visible: '多页签',
        height: '多页签高度',
        modeList: {
          mode: '多页签风格',
          chrome: '谷歌风格',
          button: '按钮风格'
        },
        isCache: '多页签缓存'
      },
      sider: {
        inverted: '侧边栏深色',
        width: '侧边栏展开宽度',
        mixWidth: '左侧混合侧边栏展开宽度'
      },
      menu: {
        horizontalPosition: '顶部菜单位置',
        horizontalPositionList: {
          flexStart: '居左',
          center: '居中',
          flexEnd: '居右'
        }
      },
      footer: {
        inverted: '底部深色',
        visible: '显示底部',
        fixed: '固定底部',
        right: '底部居右'
      },
      page: {
        animate: '页面切换动画',
        animateMode: '页面切换动画类型',
        animateModeList: {
          zoomFade: '渐变',
          zoomOut: '闪现',
          fadeSlide: '滑动',
          fade: '消退',
          fadeBottom: '底部消退',
          fadeScale: '缩放消退'
        }
      },
      systemTheme: {
        moreColors: '更多颜色'
      },
      themeConfiguration: {
        title: '主题配置',
        copy: '拷贝当前配置',
        reset: '重置当前配置',
        resetSuccess: '已重置配置，请重新拷贝！',
        operateSuccess: '操作成功',
        copySuccess: '复制成功,请替换 src/settings/theme.json的内容！',
        confirmCopy: '确认'
      }
    }
  },
  page: {
    login: {
      common: {
        userNamePlaceholder: '请输入用户名',
        phonePlaceholder: '请输入手机号',
        codePlaceholder: '请输入验证码',
        passwordPlaceholder: '请输入密码',
        confirmPasswordPlaceholder: '请再次输入密码',
        codeLogin: '验证码登录',
        confirm: '确定',
        back: '返回',
        validateSuccess: '验证成功',
        loginSuccess: '登录成功',
        loginFail: '登录失败',
        welcomeBack: '欢迎回来，{userName}!'
      },
      pwdLogin: {
        title: '密码登录',
        rememberMe: '记住我',
        forgetPassword: '忘记密码？',
        register: '注册账号',
        otherAccountLogin: '其他账号登录',
        otherLoginMode: '其他登录方式',
        superAdmin: '超级管理员',
        admin: '管理员',
        user: '普通用户',
        imgValidTitle: '请完成登录图片验证',
        slideRightValid: '向右滑动验证'
      },
      codeLogin: {
        title: '验证码登录',
        getCode: '获取验证码',
        imageCodePlaceholder: '请输入图片验证码',
        validFail: '验证失败，请重试！'
      },
      register: {
        title: '注册账号',
        agreement: '我已经仔细阅读并接受',
        protocol: '《用户协议》',
        policy: '《隐私权政策》'
      },
      scanLogin: {
        title: '扫码登录'
      },
      resetPwd: {
        title: '重置密码'
      },
      bindWeChat: {
        title: '绑定微信'
      },
      signLogin: {
        title: '签名登录',
        userIDPlaceholder: '请输入userID',
        userSigPlaceholder: '请输入userSig'
      }
    },
    chat: {
      noneChat: '暂无会话',
      userInfo: {
        avatar: '头像',
        nickname: '昵称',
        remark: '备注',
        addSource: '添加来源',
        addTime: '添加时间',
        gender: '性别',
        birthday: '出生日期',
        signature: '签名',
        groupName: '分组',
        friendAddPermission: '好友添加权限',
        friendAddPermissionOptions: {
          unknown: '未知',
          allowAnybodyAddFriend: '允许任何人添加好友',
          addFriendNeedConfirm: '添加好友需要验证',
          denyAnybodyAddFriend: '拒绝任何人添加好友'
        },
        editProfile: '编辑资料'
      },
      chatTop: '会话置顶',
      cancelTop: '取消置顶',
      messageWithoutInterruption: '消息免打扰',
      removeMessageWithoutInterruption: '移除消息免打扰',
      badgeRead: '标记已读',
      badgeUnRead: '标记未读',
      removeChat: '移除会话',
      removeChatAndKeepMessage: '移除会话并保留消息',
      sureRemoveChatAndKeepMessage: '确认要移除该会话并保留消息吗？',
      removeChatAndClearMessage: '移除会话并清除消息',
      sureRemoveChatAndClearMessage: '确认要移除该会话并清除消息吗？',
      clearMessage: '清除消息',
      sureClearMessage: '确认要清除该会话的消息吗？',
      msg: {
        speak: '朗读',
        download: '下载',
        mutedPlay: '静音播放',
        copy: '复制',
        paste: '粘贴',
        forward: '转发',
        multiSelect: '多选',
        delete: '删除',
        revoke: '撤回',
        forwardToFriend: '转发给好友',
        edit: '编辑',
        quote: '引用'
      },
      chatSetting: {
        chatHistory: '聊天记录',
        clearChatHistory: '清除聊天记录',
        messageWithoutInterruption: '消息免打扰',
        chatTop: '会话置顶',
        exitGroupChat: '退出群聊'
      },
      loadMoreMessage: '加载更多消息',
      noMoreMessage: '没有更多消息了',
      you: '你',
      revokeAMessage: '撤回了一条消息',
      saidAGreet: '打了个招呼',
      personalCard: '个人名片',
      friendIsOnline: '好友上线了',
      chatHistory: '聊天记录',
      callResult: {
        accept: '接受通话',
        rejected: '拒绝通话',
        cancelled: '取消通话',
        noResponse: '未接听',
        busy: '忙线'
      },
      friendApplyMessage: '麻烦通过我的朋友请求！',
      multiSelect: {
        mergeAndForward: '合并转发',
        forwardByItem: '逐条转发'
      },
      currentQuoteDoesNotExist: '当前引用消息在消息列表中不存在'
    },
    contacts: {
      friendList: '好友列表',
      myGroup: '我的群组',
      friendApply: '好友申请',
      blacklist: '黑名单',
      addFriend: '添加好友',
      sendMessage: '发送消息',
      createGroup: '创建群组',
      noneFriend: '暂无好友',
      noneGroup: '暂无群组',
      noneApply: '暂无申请',
      noneBlacklist: '暂无黑名单',
      delete: '删除',
      sureDelete: '确认要删除该好友吗？',
      addToBlacklist: '加入黑名单',
      sureAddToBlacklist: '确认要将该好友加入黑名单吗？',
      removeFromBlacklist: '移出黑名单',
      sureRemoveFromBlacklist: '确认要将该好友移出黑名单吗？',
      addFriendModal: {
        userID: '用户ID',
        userIdRequired: '用户ID不能为空',
        friendType: '好友类型',
        remark: '备注',
        group: '分组',
        source: '来源描述',
        sourceValue: 'IM客户端',
        wording: '附言',
        applySuccess: '发送申请成功，请等待对方同意',
        applyFailed: '发送申请失败'
      },
      createGroupModal: {
        groupName: '群组名称',
        groupNameRequired: '群组名称不能为空',
        groupType: '群组类型',
        groupTypeRequired: '群组类型不能为空',
        setAdministrator: '设置管理员',
        setAdministratorRequired: '管理员不能为空',
        groupAnnouncement: '群公告',
        groupAnnouncementRequired: '群公告不能为空',
        createSuccess: '创建成功',
        createFailed: '创建失败'
      },
      wording: '附言：',
      agree: '同意',
      reject: '拒绝',
      waitAgree: '您的申请正在等待对方同意',
      friendApplySource: {
        from: '来自：',
        contact: '联系人',
        search: '搜索',
        scan: '扫码'
      }
    },
    setting: {
      accountSetting: '账号设置',
      editInfo: '编辑资料',
      formValid: {
        nicknameIsRequired: '昵称不能为空'
      },
      systemSetting: '系统设置',
      about: '关于',
      applicationName: '应用名称',
      version: '版本',
      checkUpdate: '检查更新',
      author: '作者',
      help: '帮助',
      helpDocument: '帮助文档',
      feedback: '反馈',
      submitFeedback: '提交反馈'
    }
  },
  callChat: {
    waiting: '等待对方接受邀请...',
    microphoneIsOpen: '麦克风已开',
    microphoneIsClose: '麦克风已关',
    speakerIsOpen: '扬声器已开',
    speakerIsClose: '扬声器已关',
    cameraIsOpen: '摄像头已开',
    cameraIsClose: '摄像头已关'
  },
  mediaPreview: {
    noMoreMedia: '没有更多媒体资源了',
    prev: '上一个',
    next: '下一个',
    rotateLeft: '向左旋转',
    rotateRight: '向右旋转',
    zoomIn: '放大',
    zoomOut: '缩小',
    resetOrigin: '图片原始大小',
    download: '下载'
  }
}

export default locale
