export type VoteVerdict = 'YES' | 'NO' | 'MAYBE'
export type Vote = {
  createdAt: Date
  userId: number,
  vote: VoteVerdict
}

export type Gender = 'BOY' | 'GIRL'

export type BabyNameFrontendView = { name: string, id: number }

export type BabyNameResult = { name: string, votes: { userName: string, vote: VoteVerdict }[] }