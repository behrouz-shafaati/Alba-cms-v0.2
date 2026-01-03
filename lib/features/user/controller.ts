import coreController from '@/lib/features/core/controller'
import userService from './service'
import userSchema from './schema'
import {
  Create,
  Id,
  QueryFind,
  QueryFindById,
} from '@/lib/features/core/interface'
import { z } from 'zod'
import shippingAddressCtrl from '../shippingAddress/controller'
import generateHumanId from './utils/generateUsername'

class controller extends coreController {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the userController class extended of the main parent class baseController.
   *
   * @param service - userService
   *
   * @beta
   */
  constructor(service: any) {
    super(service)
  }

  standardizationFilters(filters: any): any {
    if (typeof filters != 'object') return {}
    for (const [key, value] of Object.entries(filters)) {
      if (typeof value != 'string') continue
      if (
        key == 'userName' ||
        key == 'fullName' ||
        key == 'email' ||
        key == 'mobile'
      )
        filters[key] = { $regex: new RegExp(value, 'i') }
      if (key == 'query') {
        filters.$expr = {
          $regexMatch: {
            input: {
              $concat: [
                { $ifNull: ['$firstName', ''] },
                ' ',
                { $ifNull: ['$lastName', ''] },
                ' ',
                { $ifNull: ['$email', ''] },
                ' ',
                { $ifNull: ['$mobile', ''] },
              ],
            },
            regex: filters.query,
            options: 'i',
          },
        }
        delete filters.query
      }

      if (key == 'orderBy' && value == 'name') {
        filters.orderBy = 'firstName'
      }
      if (key == 'id') {
        filters._id = value
        delete filters.id
      }
    }
    return filters
  }

  async create(payload: Create): Promise<any> {
    let foundUser = await this.findOne({
      filters: { email: payload.params.email },
    })
    if (foundUser) {
      throw new z.ZodError([
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'string',
          path: ['email'],
          message: 'ایمیل تکراری است.',
        },
      ])
    }

    if (
      typeof payload?.params.mobile !== 'undefined' &&
      payload?.params.mobile !== '' &&
      payload?.params.mobile !== null
    )
      foundUser = await this.findOne({
        filters: { mobile: payload.params.mobile },
      })
    if (foundUser) {
      throw new z.ZodError([
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'number',
          path: ['mobile'],
          message: 'موبایل تکراری است.',
        },
      ])
    }

    const user = await super.create(payload)
    return user
  }

  async find(payload: QueryFind) {
    payload.filters = this.standardizationFilters(payload.filters)
    return super.find(payload)
  }

  async findById(payload: QueryFindById) {
    const user = await super.findById(payload)
    if (!user) return null
    const addresses = await shippingAddressCtrl.findAll({
      filters: { userId: user.id },
    })
    return { ...user, addresses: addresses.data }
  }

  async isExistUnverifiedUserEmail(email: string) {
    let foundUser = await this.findOne({
      filters: { email: email, emailVerified: false },
    })
    return !!foundUser
  }

  async isExistUnverifiedUserMobile(mobile: string) {
    let foundUser = await this.findOne({
      filters: { mobile: mobile, mobileVerified: false },
    })
    return !!foundUser
  }
  async isDuplicateUnverifiedMobileEmail({
    mobile = null,
    email = null,
    throwError = true,
  }: {
    mobile?: string | null
    email?: string | null
    throwError?: boolean
  }) {
    if (email) {
      let foundUser = await this.findOne({
        filters: { email: email },
      })
      if (!!foundUser) {
        if (throwError) throw new Error('DuplicateEmail')
        return true
      }
    }
    if (mobile) {
      let foundUser = await this.findOne({
        filters: { mobile: mobile },
      })
      if (!!foundUser) {
        if (throwError) throw new Error('DuplicateMobile')
        return true
      }
    }
    return false
  }

  async setEmailIsVerified(email: string) {
    await this.findOneAndUpdate({
      filters: { email },
      params: { emailVerified: true },
    })
  }

  async generateUniqueUsername(opt?: any) {
    let flgrepeat = true
    while (flgrepeat) {
      const userName: string = generateHumanId()
      let foundUser = await this.findOne({
        filters: { userName: userName },
      })
      if (!foundUser) return userName
    }
  }
  async updatePassword({
    userId,
    password,
  }: {
    userId: string
    password: string
  }) {
    return this.findOneAndUpdate({
      filters: userId,
      params: { password, passwordNeedsReset: false },
    })
  }
}

const userCtrl = new controller(new userService(userSchema))
export default userCtrl
