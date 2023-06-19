import {UserProvider} from './context/userContext';
import { CarritoProvider } from './context/carritoContext';
import router from './routes';
import { RouterProvider } from 'react-router-dom';


function App() {
  return (
    <UserProvider>
      <CarritoProvider>
      <RouterProvider router={router} />
      </CarritoProvider>
    </UserProvider>
  )
}

export default App
