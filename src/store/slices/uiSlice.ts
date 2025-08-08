import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UIState, Notification } from '../types';

const initialState: UIState = {
  sidebarOpen: false,
  theme: 'light',
  notifications: [],
  modals: {
    isSettingsOpen: false,
    isHelpOpen: false,
    isConfirmationOpen: false,
    isTaskCompletionOpen: false,
  },
  taskCompletion: {
    modalNumber: 1,
    lastCompletedTask: null,
    isLastTask: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    openModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = true;
    },
    
    closeModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = false;
    },
    
    closeAllModals: (state) => {
      state.modals.isSettingsOpen = false;
      state.modals.isHelpOpen = false;
      state.modals.isConfirmationOpen = false;
      state.modals.isTaskCompletionOpen = false;
    },

    showTaskCompletionModal: (state, action: PayloadAction<{ taskName: string; isLastTask: boolean }>) => {
      const { taskName, isLastTask } = action.payload;
      state.modals.isTaskCompletionOpen = true;
      state.taskCompletion.lastCompletedTask = taskName;
      state.taskCompletion.isLastTask = isLastTask;
      state.taskCompletion.modalNumber += 1;

      // Log to console when last task is completed
      if (isLastTask) {
        console.log(`🎉 Last task completed! Next modal is opened - Modal #${state.taskCompletion.modalNumber}`);
      } else {
        console.log(`✅ Task completed: ${taskName} - Modal #${state.taskCompletion.modalNumber}`);
      }
    },

    closeTaskCompletionModal: (state) => {
      state.modals.isTaskCompletionOpen = false;
    },

    resetTaskCompletion: (state) => {
      state.taskCompletion.modalNumber = 1;
      state.taskCompletion.lastCompletedTask = null;
      state.taskCompletion.isLastTask = false;
      state.modals.isTaskCompletionOpen = false;
    },

    resetUI: (state) => {
      state.sidebarOpen = false;
      state.theme = 'light';
      state.notifications = [];
      state.modals.isSettingsOpen = false;
      state.modals.isHelpOpen = false;
      state.modals.isConfirmationOpen = false;
      state.modals.isTaskCompletionOpen = false;
      state.taskCompletion.modalNumber = 1;
      state.taskCompletion.lastCompletedTask = null;
      state.taskCompletion.isLastTask = false;
    },
  },
});

export const {
  setSidebarOpen,
  toggleSidebar,
  setTheme,
  toggleTheme,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  closeAllModals,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
