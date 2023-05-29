import {UserProvider} from './context/userContext';
import router from './routes';
import { RouterProvider } from 'react-router-dom';


function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  )
}

export default App
