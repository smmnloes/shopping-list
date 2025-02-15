export type ShareInfo = {
  description: string
  files: {name: string}[]
  shareLink: string
}


export type ShareOverview = {
  id: string
  description: string
  createdBy: string
}

export type ShareInfoPublic = {
  description: string
  files: {name: string}[]
  sharedByUserName: string
}