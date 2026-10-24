
export const tableConfig = [
  { label: '邮箱', key: 'account' },
  { label: '角色', key: 'role' },
  { label: '状态', key: 'status' },
  { label: '渠道名称', key: 'placeName' },
  { label: '备注', key: 'remark' },
  { label: '创建时间', key: 'createTime' },
]
export const roleList = [
  { label: '超级管理员', value: 1 },
  { label: '渠道管理员', value: 2 },
  { label: '活动管理员', value: 5 }
]

export const roleMap = {
  0:'超超级管理员',
  1:'超级管理员',
  2:'渠道管理员',
  5:'活动管理员',
}

export const aTypeList = [
  { label: '全部', value: 0 },
  { label: '快问快答', value: 1 },
  { label: '开口说', value: 2 },
  { label: '拍小票', value: 3 },
  { label: '看视频', value: 4 },
  { label: '有奖分享', value: 5 },
  { label: '课程管理', value: 6 }
]

export const aTypeMap = {
  1: '快问快答',
  2: '开口说',
  3: '拍小票',
  4: '看视频',
  5: '有奖分享',
  6: '课程管理',
}

export const statusList = [
  { label: '全部', value: 0 },
  { label: '已赋予', value: 1 },
  { label: '已移除', value: 2 },
]