import React from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import myfetch from '../lib/myfetch'
import AuthUserContext from '../contexts/AuthUserContext'
import useWaiting from '../ui/useWaiting'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { NO_USER, AUTHENTICATED_USER, ADMIN_USER } from './routes'

export default function AuthGuard({ children, userLevel = NO_USER }) {

  const { setAuthUser, authUser, setRedirectLocation } = React.useContext(AuthUserContext)
  const [status, setStatus] = React.useState('IDLE')

  const location = useLocation()
  const { showWaiting, Waiting } = useWaiting()
  const navigate = useNavigate()

  async function checkAuthUser() {
    if(setStatus) setStatus('PROCESSING')
    showWaiting(true)
    try {
      const authUser = await myfetch.get('/users/me')
      setAuthUser(authUser)
    }
    catch(error) {
      setAuthUser(null)
      console.error(error)
      navigate('/login', { replace: true })
    }
    finally {
      showWaiting(false)
      setStatus('DONE')
    }
  }

  React.useEffect(() => {
    // Salva a rota atual para posterior redirecionamento,
    // caso a rota atual não seja o próprio login
    if(! location.pathname.includes('login')) setRedirectLocation(location)

    checkAuthUser()
  }, [location])

  // Enquanto ainda não temos a resposta do back-end para /users/me,
  // exibimos um componente Waiting
  
  if(['IDLE', 'PROCESSING'].includes(status)) return <Waiting />

  //Se não há usuário autenticado, e o nivel de acesso o exige,
  //redireciona para a página de login

  if(!authUser && userLevel > NO_USER) {
    return <Navigate to="/login" replace />
  }

  /* 
    Senão, caso haja um AUTHENTICATED_USER (usuário comum) tentando acessar
    uma rota exclusiva de ADMIN_USER, mostramos uma mensagem de
    acesso negado
  */

  if(!(authUser?.is_admin) && userLevel == ADMIN_USER) return(
    <Box>
      <Typography variant="h2" color="error">
        Acesso negado
      </Typography>
    </Box>
  )

  /* 
    Se chegou até aqui, é porque o usuário está autenticado para qualquer
    (NO_USER) ou o usuário possui o nível de acesso necessário para acessar a rota. 
  */

  return children

}