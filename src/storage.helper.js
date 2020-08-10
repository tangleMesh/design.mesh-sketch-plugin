const Settings = require('sketch/settings');

export function getPreferences (key) {
    const value = Settings.settingForKey(key);
    if (!value || typeof value !== "string" || value.length <= 0) {
        return null;
    }
    return value;
}

export function setPreferences (key, value) {
    Settings.setSettingForKey(key, value);
}