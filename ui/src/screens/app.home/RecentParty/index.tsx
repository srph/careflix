import './style.css'
import * as React from 'react'
import { useState, useEffect } from 'react'
import useRequest from '~/hooks/useRequest'
import RecentPartyCarousel from '../RecentPartyCarousel'

function RecentParty() {
  const { data, isLoading } = useRequest('/api/me/recent-parties')
  if (isLoading) return null
  return <RecentPartyCarousel parties={data.parties} isLoading={isLoading} />
}

export default RecentParty
