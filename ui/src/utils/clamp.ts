export default function clamp(number: number, min: number, max: number): number {
  return Math.max(Math.min(number, max), min)
}