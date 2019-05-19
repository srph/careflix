import get from 'lodash.get'

interface SearchMap {
  [key: string]: boolean
}

/**
 * Make it easy to search for an item inside an array
 * Use-case: Check if item in array A is in array B
 * 
 * @input
 * [{ id: 5 }, { id: 6 }, { id: 7 }, { id: 32 }]
 * @output
 * { 5: true, 6: true, 7: true, 32: true }
 * 
 * @example
 * const members = toSearchObject(party.members, 'id')
 * const isMember = members[user.id] || false // For short, you can omit `|| false` here
 * 
 * @param array 
 * @param property 
 */
export default function toSearchObject<T = any>(array: T[], property: string): SearchMap {
  return array.reduce((prev: SearchMap, current: T) => {
    prev[get(current, property)] = true
    return prev
  }, {})
}