/**
 * 消息类型枚举
 */
export enum MsgTypeEnum {
  /** 文本消息 */
  TEXT,
  /** 图片消息 */
  IMAGE,
  /** 语音消息 */
  SOUND,
  /** 自定义消息 */
  CUSTOM,
  /** 文件消息 */
  FILE,
  /** 群提示消息 */
  GROUP_TIPS,
  /** 表情消息 */
  FACE,
  /** 位置消息 */
  LOCATION,
  /** 群通知消息 */
  GROUP_REPORT,
  /** 视频消息 */
  VIDEO,
  /** 好友关系变更通知 */
  FRIEND_CHANGE,
  /** 资料变更通知 */
  PROFILE_CHANGE,
  /** 合并消息 */
  MERGE,
  /** 无效消息 */
  INVALID
}