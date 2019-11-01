import './style.css'
import * as React from 'react'
import { useState } from 'react'

function RecentParty() {
  const [parties, setParties] = useState<AppParty[]>([])
  const [isLoading, setIsLoading] = useState(false)
}

export default RecentParty