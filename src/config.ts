import { getBucket } from '@extend-chrome/storage'

export interface IConfig {
  whitelist: string[]
  clipboard: boolean
  timeout: number
}
export const Config = getBucket<IConfig>('config', 'sync')

export const Defaults: IConfig = {
  whitelist: ['*://*/*'],
  clipboard: false,
  timeout: 1000
}
