import { TOGGLE_THEME } from "./ActionType";
import { themereducer } from "./reduer/theme.reduer";
import { createContext, useReducer, useEffect } from 'react'


const initialValues = {
    theme: localStorage.getItem('data-theme') || 'light'
}

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [state, dispatch] = useReducer(themereducer, initialValues);

    const toggletheme = (val) => {
        dispatch({ type: TOGGLE_THEME, payload: val === 'light' ? 'dark' : 'light' })
    }

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', state.theme);
        localStorage.setItem('data-theme', state.theme);
    }, [state.theme]);

    return (
        <ThemeContext.Provider
            value={{...state , toggletheme}}
        >
    { children }
        </ThemeContext.Provider >
    )
}