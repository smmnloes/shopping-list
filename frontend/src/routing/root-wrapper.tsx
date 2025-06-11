import React from 'react'
import { AuthProvider } from '../providers/auth-provider.tsx'
import { OnlineStatusProvider } from '../providers/online-status-provider.tsx'
import PrivateRoute from './private-route.tsx'
import Layout from '../elements/layout.tsx'

export const RootWrapper = ({ children, privateRoute }: { privateRoute: boolean, children: React.JSX.Element }) => {

  if (document.location.hostname === 'share.mloesch.it') {
    document.title = 'Dateifreigabe'
  } else if (document.location.hostname === 'shopping.mloesch.it') {
    document.title = 'Einkaufsliste'
  } else if (document.location.hostname === 'localhost') {
    document.title = 'Einkaufsliste - local'
  }

  const wrappedChildren = privateRoute ? (<PrivateRoute>{ children }</PrivateRoute>) : children

  return <AuthProvider>
    <OnlineStatusProvider>
      <Layout>
        { wrappedChildren }
      </Layout>
    </OnlineStatusProvider>
  </AuthProvider>

}


export default RootWrapper