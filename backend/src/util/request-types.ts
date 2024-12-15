import { Request as Res } from 'express'
import { JWTGuardUserData } from '../auth/jwt.strategy'
import { LocalGuardUserData } from '../auth/local.strategy'

export type ExtendedJWTGuardRequest<BodyType> = Res<void, void, BodyType> & { user: JWTGuardUserData }
export type ExtendedLocalGuardRequest<BodyType> = Res<void, void, BodyType> & { user: LocalGuardUserData }
