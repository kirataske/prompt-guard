import { createContext, useContext, useState, useEffect } from 'react'
import t from '../i18n/translations.js'

const Ctx = createContext(null)

export function AppProvider({ children }) {
  // зберігаємо вибір у localStorage щоб не скидалось при перезавантаженні
  const [theme, setTheme] = useState(() => localStorage.getItem('pg-theme') || 'dark')
  const [lang,  setLang]  = useState(() => localStorage.getItem('pg-lang')  || 'uk')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('pg-theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('pg-lang', lang)
  }, [lang])

  function toggleTheme() { setTheme(t => t === 'dark' ? 'light' : 'dark') }
  function toggleLang()  { setLang(l  => l  === 'uk'   ? 'en'   : 'uk')  }

  return (
    <Ctx.Provider value={{ theme, lang, str: t[lang], toggleTheme, toggleLang }}>
      {children}
    </Ctx.Provider>
  )
}

// скорочення щоб не писати useContext(Ctx)
export const useApp = () => useContext(Ctx)
