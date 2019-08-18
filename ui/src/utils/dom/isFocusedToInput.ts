const inputs = [
  'input',
  'textarea',
  'select'
]

/**
 * Checks if the document is focused to any kind of input element (input, textarea, select)
 */
export default function isFocusedToInput(): boolean {
  if (!document.activeElement) {
    return false
  }
  
  for (let el of inputs) {
    if (document.activeElement.tagName.toLowerCase() === el) {
      return true
    }
  }

  return false
}