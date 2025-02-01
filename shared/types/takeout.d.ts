export type TakeoutUserInfo = {id: number, name: string, hasToPay: boolean}

export type TakeoutStateFrontend = {
  users: TakeoutUserInfo[]

  possibleActions: {
    claim: boolean
    confirm: boolean
  }
  waitingForConfirmation: boolean
  /**
   * Latest 5 payments
   */
  latestPayments: TakeoutPaymentFrontend[]
}

export type TakeoutPaymentFrontend = {
  createdAt: string
  createdById: number
}
