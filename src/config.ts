import { getBucket } from '@extend-chrome/storage'

interface IConfig {
  whitelist: string[]
}
const Config = getBucket<IConfig>('config', 'sync')

export default Config
