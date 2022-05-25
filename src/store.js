import { configureStore } from '@reduxjs/toolkit'
import counterSlice from './Reducers'

export const store = configureStore({
    reducer: {
        counter: counterSlice
    },
})