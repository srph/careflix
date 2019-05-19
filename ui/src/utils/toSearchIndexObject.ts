import get from 'lodash.get'

interface SearchMap {
  [key: string]: number
}

/**
 * Performantly get the original index of an item.
 * Use-case: Get index of item in array A in array B
 * e.g., Check if user (inside users array) is inside the invitations array
 * 
 * @input
 * [{ id: 5 }, { id: 6 }, { id: 7 }, { id: 32 }]
 * @output
 * { 5: 0, 6: 1, 7: 2, 32: 3 }
 * 
 * @example
 * const users = [{ id: 5, name: 'Hello' }]
 * const selectedUser = users[0]
 * const invitationMap = toSearchObjectIndex(party.invitations, 'recipient.id')
 * const userInvitation = party.invitations[invitationMap[users[0]]]
 * 
 * @param array 
 * @param property 
 */
export default function toSearchIndexObject<T = any>(array: T[], property: string): SearchMap {
  return array.reduce((prev: SearchMap, current: T, index: number) => {
    prev[get(current, property)] = index
    return prev
  }, {})
}