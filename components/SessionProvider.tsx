'use client'

import { SessionProvider } from 'next-auth/react'

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  // #region agent log
  const payload = {location:'SessionProvider.tsx',message:'AuthSessionProvider render',data:{isServer:typeof window==='undefined'},timestamp:Date.now(),hypothesisId:'H5'}
  if (typeof window === 'undefined' && typeof require !== 'undefined') { try { const fs=require('fs'),p=require('path').join(process.cwd(),'debug-hydration.log'); fs.appendFileSync(p,JSON.stringify(payload)+'\n') } catch (_) {} }
  const base = typeof window === 'undefined' ? 'http://127.0.0.1:3000' : ''
  fetch(`${base}/api/debug-log`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}).catch(()=>{});
  fetch('http://127.0.0.1:7242/ingest/ad12e42d-70ce-4d8f-9328-87afe6b9f2e7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}).catch(()=>{});
  // #endregion
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  )
}
