import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function EngageConnect() {
  const [status, setStatus] = useState('connecting')

  useEffect(() => {
    const connect = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          setStatus('not-logged-in')
          return
        }

        const { data: config } = await supabase
          .from('engage_config')
          .select('extension_id')
          .eq('user_id', session.user.id)
          .single()

        if (!config?.extension_id) {
          setStatus('no-extension-id')
          return
        }

        chrome.runtime.sendMessage(
          config.extension_id,
          {
            type: 'SOMYRA_AUTH',
            token: session.access_token,
            refreshToken: session.refresh_token,
            userId: session.user.id,
          },
          (response) => {
            if (chrome.runtime.lastError) {
              setStatus('failed')
              return
            }
            if (response?.success) {
              setStatus('success')
              setTimeout(() => {
                window.close()
              }, 2000)
            }
          }
        )
      } catch (err) {
        console.error(err)
        setStatus('failed')
      }
    }

    connect()
  }, [])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#080808',
      color: 'white',
      fontFamily: 'Inter, sans-serif'
    }}>
      {status === 'connecting' && (
        <p>Connecting to Somyra Engage...</p>
      )}
      {status === 'success' && (
        <p style={{ color: '#2DD4BF' }}>
          ✓ Connected! You can close this tab.
        </p>
      )}
      {status === 'failed' && (
        <>
          <p style={{ color: '#ef4444' }}>
            Connection Failed
          </p>
          <p style={{ fontSize: '14px', color: '#888' }}>
            Make sure the Somyra Engage extension is enabled in Chrome
          </p>
          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </>
      )}
      {status === 'not-logged-in' && (
        <p>Please log in to Somyra first</p>
      )}
      {status === 'no-extension-id' && (
        <p>Extension not detected. Make sure the extension is installed and refresh this page.</p>
      )}
    </div>
  )
}
