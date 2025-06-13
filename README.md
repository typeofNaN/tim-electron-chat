# TIM Electron Chat

## Project Info（项目简介）

本项目基于 Electron + Vue3 + TypeScript + Vite + NaiveUI + UnoCSS 开发，对腾讯云的TIM进行集成开发。由于腾讯云的TIM Electron demo项目仓库已被删除，此项目可作为参考。

## Download Experience（下载体验）
[Release](https://github.com/typeofNaN/tim-electron-chat/releases)

## Usage（快速上手）

先去腾讯云官网，注册申请TIM，将imSdkAppId复制，填入 `.env.xxx` 文件的 VITE_IM_SDK_APP_ID 配置项中。

开发环境：

``` sh
pnpm install

pnpm run dev

# 如果出现 throw new Error('Electron failed to install correctly, please delete node_modules/electron and try installing again'); 此类报错。则先执行：
cd node_modules/electron && node install.js

# 再到项目根目录重新运行
```

编译成可执行文件：

``` sh
pnpm run build
```

启动项目后，将UserID和UserSig填入登录页的输入框内。（如何获取UserID和UserSig参考腾讯云官网）

由于此项目暂未涉及服务端相关，可根据自身需要将账户登录改为服务端授权模式。

## Project Preview（项目预览）

### Login Page（登录页面）

![登录页面](./screenshots/login.jpg)

### My Info（我的信息）

![我的信息](./screenshots/my-info.jpg)

### Search（搜索）

![搜索](./screenshots/search.jpg)

### Create Group（创建群组）

![创建群组](./screenshots/create-group.jpg)

### Conv Operation（会话操作）

![会话操作](./screenshots/conv-operation.jpg)

### Chat Page（聊天页面）

![聊天页面](./screenshots/chat.jpg)

### Image Msg（图片消息）

![图片消息](./screenshots/image-msg.jpg)

### Merge Msg（合并消息）

![合并消息](./screenshots/merge-msg.jpg)

### Send Emoji（发送表情）

![发送表情](./screenshots/emojis.jpg)

### Msg Operation（消息操作）

![消息操作](./screenshots/msg-operation.jpg)

### Chat Info（聊天信息）

![聊天信息](./screenshots/chat-info.jpg)

### Friend Info（朋友信息）

![朋友信息](./screenshots/user-info.jpg)

### Edit Friend Remark（好友备注）

![好友备注](./screenshots/edit-profile.jpg)

### Friend List（好友列表）

![好友列表](./screenshots/friend-list.jpg)

### Add friend（添加好友）

![添加好友](./screenshots/add-friend.jpg)

### My Group（我的群组）

![我的群组](./screenshots/my-group.jpg)

### Friend Apply（好友申请）

![好友申请](./screenshots/friend-apply.jpg)

### Blacklist（黑名单）

![黑名单](./screenshots/blacklist.jpg)

### Account Setting（账户设置）

![账户设置](./screenshots/account-setting.jpg)

### Edit Account Info（编辑账户信息）

![编辑账户信息](./screenshots/edit-account-info.jpg)

### System Setting（系统设置）

![系统设置](./screenshots/system-setting.jpg)

### About（关于）

![关于](./screenshots/about.jpg)

### I18n（多语言）

![多语言](./screenshots/i18n.jpg)

### Dark Mode（暗黑模式）

![暗黑模式](./screenshots/dark-mode.jpg)

## License MIT
