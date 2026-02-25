import { useAsync } from './useAsync'
import { fetchSettings } from './settingsApi'

export function useSettings(keys) {
  return useAsync(() => fetchSettings(keys), [keys.join('|')])
}
