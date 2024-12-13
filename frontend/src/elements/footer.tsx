import packageJson from '../../../package.json'

function Footer() {
  return (
    <>
      <footer className="footer">
        <div>v{ packageJson.version }</div>
      </footer>
    </>
  )
}

export default Footer




