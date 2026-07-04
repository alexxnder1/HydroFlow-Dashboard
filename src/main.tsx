import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { ChakraProvider } from '@chakra-ui/react'
import { createSystem, defaultConfig } from "@chakra-ui/react";

export const system = createSystem(defaultConfig);

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <ChakraProvider value={system}>
      <App />
    </ChakraProvider>
  /* </StrictMode>,} */
)
