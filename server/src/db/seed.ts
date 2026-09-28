import 'dotenv/config'
import { DataStore } from './store.js'

const store = new DataStore()
await store.init()
console.log(`ClubConnect data ready (${store.isPersistent ? 'managed MySQL' : 'in-memory preview store'})`)
await store.close()
