export type NoteOverview = {
  id: number
  title: string
  createdAt: string
  lastUpdatedAt: string
  lastUpdatedBy: string
  createdBy: string
  publiclyVisible: boolean
}

export type NoteDetails = {
  id: number
  content: string
  publiclyVisible: boolean
  permissions: { delete: boolean, changeVisibility: boolean }
}
