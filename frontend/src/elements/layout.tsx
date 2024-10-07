import Header from './header'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({children}: LayoutProps) => {
  return (
    <>
      <div className="container">
        <Header/>
        <main>{ children }</main>
      </div>
    </>
  )
}

export default Layout