export default function getValidationMessage(errors: AppValidationBag, key: string) {
  return errors[key] ? errors[key][0] : ''
}