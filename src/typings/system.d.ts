/** 请求的相关类型 */
declare namespace Service {
  /**
   * 请求的错误类型：
   * - axios: axios错误：网络错误, 请求超时, 默认的兜底错误
   * - http: 请求成功，响应的http状态码非200的错误
   * - backend: 请求成功，响应的http状态码为200，由后端定义的业务错误
   */
  type RequestErrorType = 'axios' | 'http' | 'backend'

  /** 请求错误 */
  interface RequestError {
    /** 请求服务的错误类型 */
    type: RequestErrorType
    /** 错误码 */
    code: string | number
    /** 错误信息 */
    msg: string
  }

  /** 后端接口返回的数据结构配置 */
  interface BackendResultConfig {
    /** 表示后端请求状态码的属性字段 */
    codeKey: string
    /** 表示后端请求数据的属性字段 */
    dataKey: string
    /** 表示后端消息的属性字段 */
    msgKey: string
    /** 后端业务上定义的成功请求的状态 */
    successCode: number | string
  }

  /** 自定义的请求成功结果 */
  interface SuccessResult<T = any> {
    /** 请求错误 */
    error: null
    /** 请求数据 */
    data: T
  }

  /** 自定义的请求失败结果 */
  interface FailedResult {
    /** 请求错误 */
    error: RequestError
    /** 请求数据 */
    data: null
  }

  /** 自定义的请求结果 */
  type RequestResult<T = any> = SuccessResult<T> | FailedResult

  /** 多个请求数据结果 */
  type MultiRequestResult<T extends any[]> = T extends [infer First, ...infer Rest]
    ? [First] extends [any]
    ? Rest extends any[]
    ? [Service.RequestResult<First>, ...MultiRequestResult<Rest>]
    : [Service.RequestResult<First>]
    : Rest extends any[]
    ? MultiRequestResult<Rest>
    : []
    : []

  /** 请求结果的适配器函数 */
  type ServiceAdapter<T = any, A extends any[] = any> = (...args: A) => T

  /** mock示例接口类型：后端接口返回的数据的类型 */
  interface MockServiceResult<T = any> {
    /** 状态码 */
    code: string | number
    /** 接口数据 */
    data: T
    /** 接口消息 */
    message: string
  }

  /** mock的响应option */
  interface MockOption {
    url: Record<string, any>
    body: Record<string, any>
    query: Record<string, any>
    headers: Record<string, any>
  }
}

/** 主题相关类型 */
declare namespace Theme {
  /** 主题配置 */
  interface Setting {
    /** 暗黑模式 */
    darkMode: boolean
    /** 是否自动跟随系统主题 */
    followSystemTheme: boolean
    /** 自定义暗黑动画过渡 */
    isCustomizeDarkModeTransition: boolean
    /** 布局样式 */
    layout: Layout
    /** 滚动模式 */
    scrollMode: UnionKey.ThemeScrollMode
    /** 滚动模式列表 */
    scrollModeList: Common.OptionWithKey<UnionKey.ThemeScrollMode>[]
    /** 主题颜色 */
    themeColor: string
    /** 主题颜色列表 */
    themeColorList: string[]
    /** 其他颜色 */
    otherColor: OtherColor
    /** 是否自定义info的颜色(默认取比主题色深一级的颜色) */
    isCustomizeInfoColor: boolean
    /** 固定头部和多页签 */
    fixedHeaderAndTab: boolean
    /** 显示重载按钮 */
    showReload: boolean
    /** 头部样式 */
    header: Header
    /** 标多页签样式 */
    tab: Tab
    /** 侧边栏样式 */
    sider: Sider
    /** 菜单样式 */
    menu: Menu
    /** 底部样式 */
    footer: Footer
    /** 页面样式 */
    page: Page
  }
  /** 布局样式 */
  interface Layout {
    /** 最小宽度 */
    minWidth: number
    /** 布局模式 */
    mode: UnionKey.ThemeLayoutMode
    /** 布局模式列表 */
    modeList: Common.OptionWithKey<UnionKey.ThemeLayoutMode>[]
  }

  /** 其他主题颜色 */
  interface OtherColor {
    /** 信息 */
    info: string
    /** 成功 */
    success: string
    /** 警告 */
    warning: string
    /** 错误 */
    error: string
  }

  /** 头部样式 */
  interface Header {
    /** 头部反转色 */
    inverted: boolean
    /** 头部高度 */
    height: number
    /** 面包屑样式 */
    crumb: Crumb
  }
  /** 面包屑样式 */
  interface Crumb {
    /** 面包屑可见 */
    visible: boolean
    /** 显示图标 */
    showIcon: boolean
  }

  /** 标多页签样式 */
  export interface Tab {
    /** 多页签可见 */
    visible: boolean
    /** 多页签高度 */
    height: number
    /** 多页签风格 */
    mode: UnionKey.ThemeTabMode
    /** 多页签风格列表 */
    modeList: Common.OptionWithKey<UnionKey.ThemeTabMode>[]
    /** 开启多页签缓存 */
    isCache: boolean
  }

  /** 侧边栏样式 */
  interface Sider {
    /** 侧边栏反转色 */
    inverted: boolean
    /** 侧边栏宽度 */
    width: number
    /** 侧边栏折叠时的宽度 */
    collapsedWidth: number
    /** vertical-mix模式下侧边栏宽度 */
    mixWidth: number
    /** vertical-mix模式下侧边栏折叠时的宽度 */
    mixCollapsedWidth: number
    /** vertical-mix模式下侧边栏的子菜单的宽度 */
    mixChildMenuWidth: number
  }

  /** 菜单样式 */
  interface Menu {
    /** 水平模式的菜单的位置 */
    horizontalPosition: UnionKey.ThemeHorizontalMenuPosition
    /** 水平模式的菜单的位置列表 */
    horizontalPositionList: Common.OptionWithKey<UnionKey.ThemeHorizontalMenuPosition>[]
  }

  /** 底部样式 */
  interface Footer {
    /* 底部是否可见 */
    visible: boolean
    /** 是否固定底部 */
    fixed: boolean
    /** 底部是否居右(顶部混合菜单模式有效) */
    right: boolean
    /** 底部高度 */
    height: number
    /** 底部反转色 */
    inverted: boolean
  }

  /** 页面样式 */
  interface Page {
    /** 页面是否开启动画 */
    animate: boolean
    /** 动画类型 */
    animateMode: UnionKey.ThemeAnimateMode
    /** 动画类型列表 */
    animateModeList: Common.OptionWithKey<UnionKey.ThemeAnimateMode>[]
  }
}

declare namespace App {
  /** 全局头部属性 */
  interface GlobalHeaderProps {
    /** 显示logo */
    showLogo: boolean
    /** 显示头部菜单 */
    showHeaderMenu: boolean
    /** 显示菜单折叠按钮 */
    showMenuCollapse: boolean
  }

  /** 菜单项配置 */
  type GlobalMenuOption = import('naive-ui').MenuOption & {
    key: string
    label: string
    routeName: string
    routePath: string
    icon?: () => import('vue').VNodeChild
    children?: GlobalMenuOption[]
    i18nTitle?: I18nType.I18nKey
  }

  /** 面包屑 */
  type GlobalBreadcrumb = Omit<import('naive-ui').DropdownOption, 'icon'> & {
    key: string
    label: string
    disabled: boolean
    routeName: string
    hasChildren: boolean
    icon?: import('vue').Component
    i18nTitle?: I18nType.I18nKey
    options?: (import('naive-ui/es/dropdown/src/interface').DropdownMixedOption & { i18nTitle?: I18nType.I18nKey })[]
  }

  /** 多页签Tab的路由 */
  interface GlobalTabRoute
    extends Pick<import('vue-router').RouteLocationNormalizedLoaded, 'name' | 'fullPath' | 'meta'> {
    /** 滚动的位置 */
    scrollPosition: {
      left: number
      top: number
    }
  }

  interface MessageTab {
    /** tab的key */
    key: number
    /** tab名称 */
    name: string
    /** badge类型 */
    badgeProps?: import('naive-ui').BadgeProps
    /** 消息数据 */
    list: MessageList[]
  }

  interface MessageList {
    /** 数据唯一值 */
    id: number
    /** 头像 */
    avatar?: string
    /** 消息icon */
    icon?: string
    svgIcon?: string
    /** 消息标题 */
    title: string
    /** 消息发送时间 */
    date?: string
    /** 消息是否已读 */
    isRead?: boolean
    /** 消息描述 */
    description?: string
    /** 标签名称 */
    tagTitle?: string
    /** 标签props */
    tagProps?: import('naive-ui').TagProps
  }
}

declare namespace I18nType {
  type LangType = 'en' | 'zh-CN'

  type Schema = {
    system: {
      title: string
      updateApplication: string
      notNeedUpdate: string
    }
    common: {
      success: string
      fail: string
      add: string
      addSuccess: string
      addFail: string
      edit: string
      editSuccess: string
      editFail: string
      delete: string
      deleteSuccess: string
      deleteFail: string
      batchDelete: string
      operationSuccess: string
      operationFail: string
      confirm: string
      cancel: string
      close: string
      reject: string
      accept: string
      pleaseCheckValue: string
      action: string
      search: string
      pleaseInputSearchValue: string
      noData: string
      copy: {
        browserNotSupportedCopy: string
        copySuccess: string
        copyFail: string
      }
      yes: string
      no: string
      placeholder: {
        pleaseInput: string
        pleaseSelect: string
        pleaseUpload: string
      }
      fullScreen: string
      exitFullScreen: string
      themeMode: string
      themeConfig: string
    }
    gender: {
      unknown: string
      female: string
      male: string
    }
    chat: {
      send: string
      emojis: string
      sendImage: string
      sendVideo: string
      sendFile: string
      screenshot: string
      installSnippingtool: string
      chatHistory: string
      exitEditMode: string
      videoChat: string
      voiceCall: string
      search: {
        _value: string
        contacts: string
        group: string
        message: string
      }
      edited: string
      systemNotification: string
    }
    msgPlaceholders: {
      image: string
      sound: string
      customMessage: string
      personalCard: string
      file: string
      location: string
      video: string
      friendApply: string
      chatHistory: string
      personalCenter: string
      photoGroup: string
      friendOnlineNotification: string
    }
    msgNotification: {
      sendAMessageToYou: string
      image: string
      sound: string
      customMessage: string
      file: string
      video: string
      inviteVideoChat: string
      inviteVoiceChat: string
    }
    app: {
      ctrl: {
        fullScreen: string
        exitFullScreen: string
        dragMove: string
        topUp: string
        minimize: string
        maximize: string
        unMaximize: string
        restore: string
        exitApp: string
      }
      exit: {
        title: string
        content: string
        confirm: string
        cancel: string
        miniSize: string
      }
    }
    tip: {
      tokenExpire: string
      toAppLook: string
    }
    tab: {
      contentMenu: {
        fullScreen: string
        reload: string
        close: string
        closeOther: string
        closeLeft: string
        closeRight: string
        closeAll: string
      }
    }
    formValid: {
      notEmpty: string
      enterUserName: string
      enterPhoneNumber: string
      phoneNumberFormatError: string
      enterPassword: string
      passwordFormatError: string
      enterValidCode: string
      validCodeFormatError: string
      validCodeError: string
      enterEmail: string
      emailFormatError: string
      enterConfirmPassword: string
      confirmPasswordError: string
    }
    routes: {
      dashboard: {
        _value: string
        analysis: string
        workbench: string
      }
      document: {
        _value: string
        vue: string
        vite: string
        naive: string
        project: string
        'project-link': string
      }
      component: {
        _value: string
        button: string
        card: string
        table: string
      }
      plugin: {
        _value: string
        charts: {
          _value: string
          antv: string
          echarts: string
        }
        copy: string
        editor: {
          _value: string
          markdown: string
          quill: string
        }
        icon: string
        map: string
        print: string
        swiper: string
        video: string
      }
      'auth-demo': {
        _value: string
        permission: string
        super: string
      }
      function: {
        _value: string
        tab: string
      }
      exception: {
        _value: string
        '403': string
        '404': string
        '500': string
      }
      home: {
        _value: string
      }
      contacts: {
        _value: string
      }
      setting: {
        _value: string
      }
      callChat: {
        _value: string
      }
      mediaPreview: {
        _value: string
      }
      management: {
        _value: string
        auth: string
        role: string
        route: string
        user: string
      }
      about: string
    }
    layout: {
      userAvatar: {
        logout: string
        tip: string
        askLogout: string
      }
      settingDrawer: {
        title: string
        themeModeTitle: string
        darkMode: string
        layoutModelTitle: string
        systemThemeTitle: string
        pageFunctionsTitle: string
        pageViewTitle: string
        followSystemTheme: string
        isCustomizeDarkModeTransition: string
        scrollMode: string
        scrollModeList: {
          wrapper: string
          content: string
        }
        fixedHeaderAndTab: string
        header: {
          inverted: string
          height: string
          crumb: {
            visible: string
            icon: string
          }
        }
        tab: {
          visible: string
          height: string
          modeList: {
            mode: string
            chrome: string
            button: string
          }
          isCache: string
        }
        sider: {
          inverted: string
          width: string
          mixWidth: string
        }
        menu: {
          horizontalPosition: string
          horizontalPositionList: {
            flexStart: string
            center: string
            flexEnd: string
          }
        }
        footer: {
          inverted: string
          visible: string
          fixed: string
          right: string
        }
        page: {
          animate: string
          animateMode: string
          animateModeList: {
            zoomFade: string
            zoomOut: string
            fadeSlide: string
            fade: string
            fadeBottom: string
            fadeScale: string
          }
        }
        systemTheme: {
          moreColors: string
        }
        themeConfiguration: {
          title: string
          copy: string
          reset: string
          resetSuccess: string
          operateSuccess: string
          copySuccess: string
          confirmCopy: string
        }
      }
    }
    page: {
      login: {
        common: {
          userNamePlaceholder: string
          phonePlaceholder: string
          codePlaceholder: string
          passwordPlaceholder: string
          confirmPasswordPlaceholder: string
          codeLogin: string
          confirm: string
          back: string
          validateSuccess: string
          loginSuccess: string
          loginFail: string
          welcomeBack: string
        }
        pwdLogin: {
          title: string
          rememberMe: string
          forgetPassword: string
          register: string
          otherAccountLogin: string
          otherLoginMode: string
          superAdmin: string
          admin: string
          user: string
          imgValidTitle: string
          slideRightValid: string
        }
        codeLogin: {
          title: string
          getCode: string
          imageCodePlaceholder: string
          validFail: string
        }
        scanLogin: {
          title: string
        }
        register: {
          title: string
          agreement: string
          protocol: string
          policy: string
        }
        resetPwd: {
          title: string
        }
        bindWeChat: {
          title: string
        }
        signLogin: {
          title: string
          userIDPlaceholder: string
          userSigPlaceholder: string
        }
      }
      chat: {
        noneChat: string
        userInfo: {
          avatar: string
          nickname: string
          remark: string
          addSource: string
          addTime: string
          gender: string
          birthday: string
          signature: string
          groupName: string
          friendAddPermission: string
          friendAddPermissionOptions: {
            unknown: string
            allowAnybodyAddFriend: string
            addFriendNeedConfirm: string
            denyAnybodyAddFriend: string
          }
          editProfile: string
        }
        chatTop: string
        cancelTop: string
        messageWithoutInterruption: string
        removeMessageWithoutInterruption: string
        badgeRead: string
        badgeUnRead: string
        removeChat: string
        removeChatAndKeepMessage: string
        sureRemoveChatAndKeepMessage: string
        removeChatAndClearMessage: string
        sureRemoveChatAndClearMessage: string
        clearMessage: string
        sureClearMessage: string
        msg: {
          speak: string
          download: string
          mutedPlay: string
          copy: string
          paste: string
          forward: string
          multiSelect: string
          delete: string
          revoke: string
          forwardToFriend: string
          edit: string
          quote: string
        }
        chatSetting: {
          chatHistory: string
          clearChatHistory: string
          messageWithoutInterruption: string
          chatTop: string
          exitGroupChat: string
        }
        loadMoreMessage: string
        noMoreMessage: string
        you: string
        revokeAMessage: string
        saidAGreet: string
        personalCard: string
        friendIsOnline: string
        chatHistory: string
        callResult: {
          accept: string
          rejected: string
          cancelled: string
          noResponse: string
          busy: string
        }
        friendApplyMessage: string
        multiSelect: {
          mergeAndForward: string
          forwardByItem: string
        }
        currentQuoteDoesNotExist: string
      }
      contacts: {
        friendList: string
        myGroup: string
        friendApply: string
        blacklist: string
        addFriend: string
        sendMessage: string
        createGroup: string
        noneFriend: string
        noneGroup: string
        noneApply: string
        noneBlacklist: string
        delete: string
        sureDelete: string
        addToBlacklist: string
        sureAddToBlacklist: string
        removeFromBlacklist: string
        sureRemoveFromBlacklist: string
        addFriendModal: {
          userID: string
          userIdRequired: string
          friendType: string
          remark: string
          group: string
          source: string
          sourceValue: string
          wording: string
          applySuccess: string
          applyFailed: string
        }
        createGroupModal: {
          groupName: string
          groupNameRequired: string
          groupType: string
          groupTypeRequired: string
          setAdministrator: string
          setAdministratorRequired: string
          groupAnnouncement: string
          groupAnnouncementRequired: string
          createSuccess: string
          createFailed: string
        }
        wording: string
        agree: string
        reject: string
        waitAgree: string
        friendApplySource: {
          from: string
          contact: string
          search: string
          scan: string
        }
      }
      setting: {
        accountSetting: string
        editInfo: string
        formValid: {
          nicknameIsRequired: string
        }
        systemSetting: string
        about: string
        applicationName: string
        version: string
        checkUpdate: string
        author: string
        help: string
        helpDocument: string
        feedback: string
        submitFeedback: string
      }
    }
    callChat: {
      waiting: string
      microphoneIsOpen: string
      microphoneIsClose: string
      speakerIsOpen: string
      speakerIsClose: string
      cameraIsOpen: string
      cameraIsClose: string
    }
    mediaPreview: {
      noMoreMedia: string
      prev: string
      next: string
      rotateLeft: string
      rotateRight: string
      zoomIn: string
      zoomOut: string
      resetOrigin: string
      download: string
    }
  }

  type GetI18nKey<T extends Record<string, unknown>, K extends keyof T = keyof T> = K extends string
    ? T[K] extends Record<string, unknown>
    ? `${K}.${GetI18nKey<T[K]>}`
    : K
    : never

  type I18nKey = GetI18nKey<Schema>
}
