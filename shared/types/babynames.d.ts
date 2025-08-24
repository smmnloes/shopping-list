export type VoteVerdict = 'YES' | 'NO' | 'MAYBE'
export type Vote = {
  createdAt: Date
  userId: number,
  vote: VoteVerdict
}

export type Gender = 'BOY' | 'GIRL'
