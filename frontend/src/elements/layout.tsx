import Header from './header'
import { ReactNode } from 'react'
import Footer from './footer.tsx'

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({children}: LayoutProps) => {
  return (
    <>
      <Header/>
      <div className="container">
        <main>{ children }</main>
      </div>
      <Footer/>
    </>
  )
}

export default Layout