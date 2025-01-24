// utils/withParichayAuth.js
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

const checkCookies = (context) => {
  const govEnc = context.req ? Cookies.get('govEnc', { headers: context.req.headers }) : Cookies.get('uid')
  return { govEnc }
}

const withParichayAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter()

    useEffect(() => {

      const { govEnc } = checkCookies({ req: typeof window === 'undefined' ? ctx.req : undefined })
      // Check if cookies are available, and if not, redirect to the login page
      if ((!govEnc && !router.pathname.includes('/login'))) {
        router.push('/login')
      }

    }, [])

    return <WrappedComponent {...props} />
  }
}

export default withParichayAuth