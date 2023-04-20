import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  sidebarOpen: true,
  windowWidth: 1000,
  backlogEpicOpen: false,
  backlogContainerWidth: 720,
  backlogTableWidth: 0,
}
const miniWidth = 65
const scrollerWidth = 6
const sidebarOpenWidth = 241 // includes 1px border width
const sidebarCloseWidth = 12 // includes 1px border width
const epicOpenWidth = 216
const epicCloseWidth = 38

export const projectUiSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    toggleSidebar: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      state.sidebarOpen = action.payload
      state.backlogContainerWidth = calculateBacklogContainerWidth(state.sidebarOpen, state.backlogEpicOpen, state.windowWidth)
    },
    toggleEpic: (state, action) => {
      state.backlogEpicOpen = action.payload
      state.backlogContainerWidth = calculateBacklogContainerWidth(state.sidebarOpen, state.backlogEpicOpen, state.windowWidth)
    },
    setWindowWidth: (state, action) => {
      state.windowWidth = action.payload
      state.backlogContainerWidth = calculateBacklogContainerWidth(state.sidebarOpen, state.backlogEpicOpen, action.payload)
    },
    setBacklogTableWidth: (state, action) => {
      state.backlogTableWidth = action.payload
    },
  },
})

const calculateBacklogContainerWidth = (sidebarOpen, backlogEpicOpen, windowWidth) => {
  let backlogWidth = windowWidth - miniWidth - scrollerWidth
  backlogWidth = sidebarOpen ? backlogWidth - sidebarOpenWidth : backlogWidth - sidebarCloseWidth
  backlogWidth = backlogEpicOpen ? backlogWidth - epicOpenWidth - 3 : backlogWidth - epicCloseWidth
  return backlogWidth
}

// Action creators are generated for each case reducer function
export const { toggleSidebar, toggleEpic, setWindowWidth, setBacklogTableWidth } = projectUiSlice.actions

export default projectUiSlice.reducer
