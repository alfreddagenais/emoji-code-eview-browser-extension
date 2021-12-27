import { writable } from 'svelte/store'
import { isInExtension } from './helpers/browser'

const AUTO_CLOSE_AFTER_COPY_KEY = 'auto-close-after-copy'
const THEME_KEY = 'theme'
const SHOW_DESCRIPTION_KEY = 'show-description'

const createPageStore = () => {
  const { subscribe, set } = writable('home')

  return {
    subscribe,
    goTo: (page) => {
      set(page)
    }
  }
}

const createUserSettingsStore = () => {
  const { subscribe, set, update } = writable({
    autoCloseAfterCopy: false,
    theme: 'light',
    showDescription: true
  })

  // get settings from storage
  if (isInExtension()) {
    /* eslint-disable-next-line no-undef */
    chrome.storage.local.get(
      [AUTO_CLOSE_AFTER_COPY_KEY, THEME_KEY, SHOW_DESCRIPTION_KEY],
      (result) => {
        const autoCloseAfterCopyValue = result[AUTO_CLOSE_AFTER_COPY_KEY] || false
        const themeValue = result[THEME_KEY] || 'light'
        const showDescriptionValue = result[SHOW_DESCRIPTION_KEY] || false

        update(settings => {
          return {
            ...settings,
            theme: themeValue,
            autoCloseAfterCopy: autoCloseAfterCopyValue,
            showDescription: showDescriptionValue
          }
        })
      }
    )
  }

  return {
    subscribe,
    setAutoCloseAfterCopy: (value) => {
      if (isInExtension()) {
        /* eslint-disable-next-line no-undef */
        chrome.storage.local.set({ [AUTO_CLOSE_AFTER_COPY_KEY]: value })
      }

      update(settings => {
        return {
          ...settings,
          autoCloseAfterCopy: value
        }
      })
    },
    setTheme: (theme) => {
      if (isInExtension()) {
        /* eslint-disable-next-line no-undef */
        chrome.storage.local.set({ [THEME_KEY]: theme })
      }

      update(settings => {
        return {
          ...settings,
          theme
        }
      })
    },
    setShowDescription: (showDescription) => {
      if (isInExtension()) {
        /* eslint-disable-next-line no-undef */
        chrome.storage.local.set({ [SHOW_DESCRIPTION_KEY]: showDescription })
      }

      update(settings => {
        return {
          ...settings,
          showDescription
        }
      })
    },
    set,
    update
  }
}

export const page = createPageStore()
export const settings = createUserSettingsStore()
