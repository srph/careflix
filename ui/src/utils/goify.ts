/**
 * promise().then().catch() -> [err, data] = promise()
 * @source https://twitter.com/DavidWells/status/1119729914876284928
 */
export default async function(promise: Promise<any>): Promise<AsyncGoReturn> {
  let data: any = null
  try {
    data = await promise
  } catch(e) {
    return [e]
  }
  return data instanceof Error ? [data] : [null, data]
}