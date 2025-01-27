export type TakeoutStateFrontend = {
  users: {id: number, name: string}[]
  /**
   * Latest 20 payments
   */
  action: CurrentTakeoutAction
  payments: TakeoutPaymentFrontend[]
}

export type TakeoutPaymentFrontend = {
  createdAt: string
  createdById: number
  confirmed: boolean
}

export type CurrentTakeoutAction = 'CONFIRMATION_NEEDED' | 'CAN_CONFIRM' | 'CAN_CLAIM' | 'NONE'