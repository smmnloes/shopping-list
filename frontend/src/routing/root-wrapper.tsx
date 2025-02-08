import React from 'react'
import { AuthProvider } from '../providers/auth-provider.tsx'
import { OnlineStatusProvider } from '../providers/online-status-provider.tsx'
import PrivateRoute from './private-route.tsx'
import Layout from '../elements/layout.tsx'

export const RootWrapper = ({ children, privateRoute }: { privateRoute: boolean, children: React.JSX.Element }) => {

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