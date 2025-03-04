/**
 * 支持的图片文件类型列表
 * 包括: jpeg, png, gif格式的图片文件
 */
export const AcceptImageFileType = [
  'image/bmp',
  'image/ico',
  'image/jpg',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/tiff',
  'image/x-icon',
  'image/x-ms-bmp'
]

/**
 * 支持的视频文件类型列表
 * 包括: mp4, webm格式的视频文件
 */
export const AcceptVideoFileType = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/avi',
  'video/mov',
  'video/wmv',
  'video/flv',
  'video/mkv'
]

/**
 * 支持的音频文件类型列表
 * 包括: mp3, ogg, wav格式的音频文件
 */
export const AcceptAudioFileType = ['audio/mpeg', 'audio/ogg', 'audio/wav']

/**
 * 支持的媒体文件类型列表
 * 包括所有支持的音频、视频和图片文件类型:
 * - 图片: jpeg, png, gif
 * - 视频: mp4, webm
 * - 音频: mp3, ogg, wav
 */
export const AcceptMediaFileType = [
  ...AcceptVideoFileType,
  ...AcceptAudioFileType,
  ...AcceptImageFileType
]

/**
 * 支持的文档文件类型列表
 * 包括常见的办公文档格式:
 * - PDF文档(.pdf)
 * - Word文档(.doc, .docx)
 * - Excel表格(.xls, .xlsx)
 * - PowerPoint演示文稿(.ppt, .pptx)
 *
 * 注意:部分文件类型有多个MIME type,需要都包含以支持不同来源的文件
 */
export const AcceptFileType = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint',
  'application/vnd.ms-word',
  'application/vnd.ms-powerpoint',
  'application/vnd.ms-excel',
  'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint'
]