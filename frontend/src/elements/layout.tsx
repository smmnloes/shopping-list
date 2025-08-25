import Header from './header'
import { ReactNode, useEffect } from 'react'
import Footer from './footer.tsx'
import { useLocation } from 'react-router-dom'

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {

  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to the top of the page with instant behavior
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);


  return (
    <>
      <Header/>
      <div className="content">
        { children }
      </div>
      <Footer/>
    </>
  )
}

export default Layout