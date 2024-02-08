import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Auth from "./Components/Pages/Auth/Auth"

function App() {
  const token = localStorage.getItem('token')

  useEffect(() => {
    const checkTokenExpiration = () => {
      const tokenExpiration = localStorage.getItem('tokenExpiration');

      if (token && tokenExpiration) {
        const expirationTime = parseInt(tokenExpiration, 10);
        const currentTime = new Date().getTime();

        if (currentTime > expirationTime) {
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiration');
        }
      }
    };

    checkTokenExpiration();

  }, []);

  // Move below function to your navbar or header or whatever you want
  // function handleLogout() {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('tokenExpiration');
  // }

  const redirect404 = () => {
    return (
      <h1>
        404 Not Found
        <br />
        {token ? 'You are logged in' : 'You are not logged in'}
        <br />
      </h1>
    )
  }

  return (
    <>
      <Router>
        <Routes>
          {!token && <Route path="/auth" element={<Auth />} />}
          <Route path="*" element={redirect404()} />
        </Routes>
      </Router>
    </>
  )
}

export default App
