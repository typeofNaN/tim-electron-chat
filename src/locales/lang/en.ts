const locale: I18nType.Schema = {
  system: {
    title: 'IM Electron Chat',
    updateApplication: 'Update Application',
    notNeedUpdate: 'Current Version Is Least Version!'
  },
  common: {
    success: 'Success',
    fail: 'Fail',
    add: 'Add',
    addSuccess: 'Add Success',
    addFail: 'Add Fail',
    edit: 'Edit',
    editSuccess: 'Edit Success',
    editFail: 'Edit Fail',
    delete: 'Delete',
    deleteSuccess: 'Delete Success',
    deleteFail: 'Delete Fail',
    batchDelete: 'Batch Delete',
    operationSuccess: 'Operation Success',
    operationFail: 'Operation Fail',
    confirm: 'Confirm',
    cancel: 'Cancel',
    close: 'Close',
    reject: 'Reject',
    accept: 'Accept',
    pleaseCheckValue: 'Please check the value is valid',
    action: 'Action',
    search: 'Search',
    pleaseInputSearchValue: 'Please enter the search value',
    noData: 'Data is Empty',
    copy: {
      browserNotSupportedCopy: 'Your browser not support copy, please change browser and try again!',
      copySuccess: 'Copy success!',
      copyFail: 'Copy fail!'
    },
    yes: 'Yes',
    no: 'No',
    placeholder: {
      pleaseInput: 'Please input',
      pleaseSelect: 'Please select',
      pleaseUpload: 'Please upload'
    }
  },
  gender: {
    unknown: 'Unknown',
    female: 'Female',
    male: 'Male'
  },
  chat: {
    send: 'Send',
    emojis: 'Emojis',
    sendImage: 'Send Image',
    sendVideo: 'Send Video',
    sendFile: 'Send File',
    chatHistory: 'Chat History',
    exitEditMode: 'Exit Edit Mode',
    videoChat: 'Video Chat',
    voiceCall: 'Voice Call',
    search: {
      _value: 'Search',
      contacts: 'Contacts',
      group: 'Group',
      message: 'Message'
    },
    edited: 'Edited',
    systemNotification: 'System Notification'
  },
  msgPlaceholders: {
    image: '[Image]',
    sound: '[Sound]',
    customMessage: '[Custom Message]',
    personalCard: '[Personal Card]',
    file: '[File]',
    location: '[Location]',
    video: '[Video]',
    friendApply: '[Friend Apply]',
    chatHistory: '[Chat History]',
    personalCenter: '[Personal Center]',
    photoGroup: '[Photo Group]',
    friendOnlineNotification: '[Friend Online Notification]'
  },
  msgNotification: {
    sendAMessageToYou: 'Send A Message To You',
    image: 'Image',
    sound: 'Sound',
    customMessage: 'Custom Message',
    file: 'File',
    video: 'Video',
    inviteVideoChat: '{ userName } Invite You Video Chat',
    inviteVoiceChat: '{ userName } Invite You Voice Chat'
  },
  app: {
    ctrl: {
      fullScreen: 'Full Screen',
      exitFullScreen: 'Exit Full Screen',
      dragMove: 'Drag Move',
      topUp: 'Top Up',
      minimize: 'Minimize',
      maximize: 'Maximize',
      unMaximize: 'UnMaximize',
      restore: 'Restore',
      exitApp: 'Exit App'
    },
    exit: {
      title: 'Exit Application',
      content: 'Are you sure exit this application?',
      confirm: 'Yes',
      cancel: 'No',
      miniSize: 'Mini Window'
    }
  },
  tip: {
    tokenExpire: 'Token expire, please login again',
    toAppLook: 'Please Enter App To Look!'
  },
  tab: {
    contentMenu: {
      fullScreen: 'FullScreen',
      reload: 'Reload',
      close: 'Close',
      closeOther: 'Close Other',
      closeLeft: 'Close Left',
      closeRight: 'Close Right',
      closeAll: 'Close All'
    }
  },
  formValid: {
    notEmpty: 'Not empty',
    enterUserName: 'Please enter the user name',
    enterPhoneNumber: 'Please enter the phone number',
    phoneNumberFormatError: 'Phone number format error',
    enterPassword: 'Please enter the password',
    passwordFormatError: 'Password format error, 6 - 18 length, number/letter',
    enterValidCode: 'Please enter the valid code',
    validCodeFormatError: 'Valid code format error',
    validCodeError: 'Valid code error',
    enterEmail: 'Please enter the Email',
    emailFormatError: 'Email format error',
    enterConfirmPassword: 'please enter the confirm password',
    confirmPasswordError: 'Confirm password error'
  },
  routes: {
    dashboard: {
      _value: 'Dashboard',
      analysis: 'Analysis',
      workbench: 'Workbench'
    },
    document: {
      _value: 'Document',
      vue: 'Vue Document',
      vite: 'Vite Document',
      naive: 'NaiveUI Document',
      project: 'Project Document',
      'project-link': 'Project Document(href)'
    },
    component: {
      _value: 'Component',
      button: 'Button',
      card: 'Card',
      table: 'Table'
    },
    plugin: {
      _value: 'Plugin',
      charts: {
        _value: 'Chart',
        echarts: 'ECharts',
        antv: 'AntV'
      },
      copy: 'Copy',
      editor: {
        _value: 'Editor',
        quill: 'Quill',
        markdown: 'Markdown'
      },
      icon: 'Icon',
      map: 'Map',
      print: 'Print',
      swiper: 'Swiper',
      video: 'Video'
    },
    'auth-demo': {
      _value: 'Auth Demo',
      permission: 'Toggle Permission',
      super: 'Super Auth'
    },
    function: {
      _value: 'Function',
      tab: 'System Tab'
    },
    exception: {
      _value: 'Exception',
      403: '403',
      404: '404',
      500: '500'
    },
    home: {
      _value: 'home'
    },
    contacts: {
      _value: 'Contacts'
    },
    setting: {
      _value: 'Setting'
    },
    callChat: {
      _value: 'Call'
    },
    imagePreview: {
      _value: 'Image Preview'
    },
    management: {
      _value: 'System Management',
      auth: 'Auth',
      role: 'Role',
      route: 'Route',
      user: 'User'
    },
    about: 'About'
  },
  layout: {
    userAvatar: {
      logout: 'Logout',
      tip: 'Tip',
      askLogout: 'Are you sure logout?'
    },
    settingDrawer: {
      title: 'Theme configuration',
      themeModeTitle: 'Theme mode',
      darkMode: 'Dark mode',
      layoutModelTitle: 'Layout mode',
      systemThemeTitle: 'System theme',
      pageFunctionsTitle: 'Page functions',
      pageViewTitle: 'Page view',
      followSystemTheme: 'Follow the system',
      isCustomizeDarkModeTransition: 'Custom dark theme animation transition',
      scrollMode: 'scrollMode',
      scrollModeList: {
        wrapper: 'Outer layer scroll',
        content: 'Main body scroll'
      },
      fixedHeaderAndTab: 'Fixed header and multiple tabs',
      header: {
        inverted: 'darkHead',
        height: 'Head Height',
        crumb: {
          visible: 'Crumb',
          icon: 'Crumb icon'
        }
      },
      tab: {
        visible: 'Multi-page tab',
        height: 'Multiple tab height',
        modeList: {
          mode: 'Multi-tab style',
          chrome: 'Google style',
          button: 'Button style'
        },
        isCache: 'Multiple tab caching'
      },
      sider: {
        inverted: 'Dark sidebar',
        width: 'Sidebar expanded width',
        mixWidth: 'Left hybrid sidebar expanded width'
      },
      menu: {
        horizontalPosition: 'Top menu position',
        horizontalPositionList: {
          flexStart: 'Right',
          center: 'center',
          flexEnd: 'Left'
        }
      },
      footer: {
        inverted: 'Dark bottom',
        visible: 'Show bottom',
        fixed: 'Fixed bottom',
        right: 'Bottom to the right'
      },
      page: {
        animate: 'switch animation',
        animateMode: 'switch animation type',
        animateModeList: {
          zoomFade: 'Gradual change',
          zoomOut: 'Flash',
          fadeSlide: 'Slide',
          fade: 'Fade away',
          fadeBottom: 'Bottom fade',
          fadeScale: 'Resizing fade away'
        }
      },
      systemTheme: {
        moreColors: 'More colors'
      },
      themeConfiguration: {
        title: 'Theme configuration',
        copy: 'Copy the current configuration',
        reset: 'Reset the current configuration',
        resetSuccess: 'The configuration has been reset, please copy it again!',
        operateSuccess: 'Successful operation',
        copySuccess: 'Copy success, please replace the content of src/settings/theme.json!',
        confirmCopy: 'Confirm'
      }
    }
  },
  page: {
    login: {
      common: {
        userNamePlaceholder: 'Please enter user name',
        phonePlaceholder: 'Please enter phone number',
        codePlaceholder: 'Please enter verification code',
        passwordPlaceholder: 'Please enter password',
        confirmPasswordPlaceholder: 'Please enter password again',
        codeLogin: 'Verification code login',
        confirm: 'Confirm',
        back: 'Back',
        validateSuccess: 'Verification passed',
        loginSuccess: 'Login success',
        loginFail: 'Login failed',
        welcomeBack: 'Welcome back, {userName}!'
      },
      pwdLogin: {
        title: 'Password Login',
        rememberMe: 'Remember me',
        forgetPassword: 'Forget password?',
        register: 'Register account',
        otherAccountLogin: 'Other Account Login',
        otherLoginMode: 'Other Login Mode',
        superAdmin: 'Super Administrator',
        admin: 'Administrator',
        user: 'Ordinary User',
        imgValidTitle: 'Image verification',
        slideRightValid: 'Slide right validation'
      },
      codeLogin: {
        title: 'Verification Code Login',
        getCode: 'Get verification code',
        imageCodePlaceholder: 'Please enter image verification code',
        validFail: 'Valid fail, please try again!'
      },
      scanLogin: {
        title: 'Scan Login'
      },
      register: {
        title: 'Register Account',
        agreement: 'I have read and agree to',
        protocol: '《User Agreement》',
        policy: '《Privacy Policy》'
      },
      resetPwd: {
        title: 'Reset Password'
      },
      bindWeChat: {
        title: 'Bind WeChat'
      },
      signLogin: {
        title: 'Sign Login',
        userIDPlaceholder: 'Please enter user ID',
        userSigPlaceholder: 'Please enter userSig'
      }
    },
    chat: {
      noneChat: 'None Chat',
      userInfo: {
        avatar: 'Avatar',
        nickname: 'Nickname',
        remark: 'Remark',
        addSource: 'Add Source',
        addTime: 'Add Time',
        gender: 'Gender',
        birthday: 'Birthday',
        signature: 'Signature',
        groupName: 'Group Name',
        friendAddPermission: 'Friend Add Permission',
        friendAddPermissionOptions: {
          unknown: 'Unknown',
          allowAnybodyAddFriend: 'Allow Anybody Add Friend',
          addFriendNeedConfirm: 'Add Friend Need Confirm',
          denyAnybodyAddFriend: 'Deny Anybody Add Friend'
        },
        editProfile: 'Edit Profile'
      },
      chatTop: 'Chat Top',
      cancelTop: 'Cancel Top',
      messageWithoutInterruption: 'Message Without Interruption',
      removeMessageWithoutInterruption: 'Remove Message Without Interruption',
      badgeRead: 'Badge Read',
      badgeUnRead: 'Badge Unread',
      removeChat: 'Remove Chat',
      removeChatAndKeepMessage: 'Remove Chat And Keep Message',
      sureRemoveChatAndKeepMessage: 'Are You Sure Remove This Conversation And Keep Message?',
      removeChatAndClearMessage: 'Remove Chat And Clear Message',
      sureRemoveChatAndClearMessage: 'Are You Sure Remove This Conversation And Clear Message?',
      clearMessage: 'Clear Message',
      sureClearMessage: 'Are You Sure Clear This Conversation Message?',
      msg: {
        speak: 'Speak',
        download: 'Download',
        mutedPlay: 'Muted Play',
        copy: 'Copy',
        paste: 'Paste',
        forward: 'Forward',
        multiSelect: 'Multi Select',
        delete: 'Delete',
        revoke: 'Revoke',
        forwardToFriend: 'Forward To Friend',
        edit: 'Edit',
        quote: 'Quote'
      },
      chatSetting: {
        chatHistory: 'Chat History',
        clearChatHistory: 'Clear Chat History',
        messageWithoutInterruption: 'Message Without Interruption',
        chatTop: 'Chat Top',
        exitGroupChat: 'Exit Group Chat'
      },
      loadMoreMessage: 'Load More Message',
      noMoreMessage: 'No More Message',
      you: 'You',
      revokeAMessage: 'Revoke A Message',
      saidAGreet: 'Said A Greet',
      personalCard: 'Personal Card',
      friendIsOnline: 'Friend Is Online',
      chatHistory: 'Chat History',
      callResult: {
        accept: 'Accept Call',
        rejected: 'Reject Call',
        cancelled: 'Cancel Call',
        noResponse: 'No Response',
        busy: 'Busy'
      },
      friendApplyMessage: 'Please Agree My Friend Apply!',
      multiSelect: {
        mergeAndForward: 'Merge And Forward',
        forwardByItem: 'Forward By Item'
      },
      currentQuoteDoesNotExist: 'Current Quote Message Does Not Exist In The Message List'
    },
    contacts: {
      friendList: 'Friend List',
      myGroup: 'My Group',
      friendApply: 'Friend Apply',
      blacklist: 'Blacklist',
      addFriend: 'Add Friend',
      sendMessage: 'Send Message',
      createGroup: 'Create Group',
      noneFriend: 'None Friend',
      noneGroup: 'None Group',
      noneApply: 'None Apply',
      noneBlacklist: 'None Blacklist',
      delete: 'Delete',
      sureDelete: 'Are You Sure Delete This Friend?',
      addToBlacklist: 'Add To Blacklist',
      sureAddToBlacklist: 'Are You Sure Add This Friend To Blacklist?',
      removeFromBlacklist: 'Remove From Blacklist',
      sureRemoveFromBlacklist: 'Are You Sure Remove This Friend From Blacklist?',
      addFriendModal: {
        userID: 'User ID',
        userIdRequired: 'User ID is required',
        friendType: 'Friend Type',
        remark: 'Remark',
        group: 'Group',
        source: 'Source',
        sourceValue: 'IM Client',
        wording: 'Wording',
        applySuccess: 'Send application success, please wait for the other party to agree',
        applyFailed: 'Send application failed'
      },
      createGroupModal: {
        groupName: 'Group Name',
        groupNameRequired: 'Group name is required',
        groupType: 'Group Type',
        groupTypeRequired: 'Group type is required',
        setAdministrator: 'Administrator',
        setAdministratorRequired: 'Administrator is required',
        groupAnnouncement: 'Group Announcement',
        groupAnnouncementRequired: 'Group announcement is required',
        createSuccess: 'Create success',
        createFailed: 'Create failed'
      },
      wording: 'Wording:',
      agree: 'Agree',
      reject: 'Reject',
      waitAgree: 'Your application is waiting for the other party to agree',
      friendApplySource: {
        from: 'From:',
        contact: 'Contact',
        search: 'Search',
        scan: 'Scan'
      }
    },
    setting: {
      accountSetting: 'Account Setting',
      editInfo: 'Edit Info',
      formValid: {
        nicknameIsRequired: 'Nickname is required'
      },
      systemSetting: 'System Setting',
      about: 'About',
      applicationName: 'Application Name',
      version: 'Version',
      checkUpdate: 'Check Update',
      author: 'Author',
      help: 'Help',
      helpDocument: 'Help Document',
      feedback: 'Feedback',
      submitFeedback: 'Submit Feedback'
    }
  },
  callChat: {
    waiting: 'Waiting for accept the invitation ...',
    microphoneIsOpen: 'Microphone Is Open',
    microphoneIsClose: 'Microphone Is Close',
    speakerIsOpen: 'Speaker Is Open',
    speakerIsClose: 'Speaker Is Close',
    cameraIsOpen: 'Camera Is Open',
    cameraIsClose: 'Camera Is Close'
  },
  imagePreview: {
    noMoreImage: 'No More Images'
  }
}

export default locale
