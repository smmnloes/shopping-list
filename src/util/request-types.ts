import { Request as Res } from 'express'
import { UserInformation } from '../auth/auth.service'

export type ExtendedRequest<BodyType> = Res<void, void, BodyType> & UserInfoAddedByPassport

export type UserInfoAddedByPassport = {
  user: UserInformation
}