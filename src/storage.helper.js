const pluginIdentifier = "com.design-mesh.sketch.sketch-plugin";
const userDefaults = NSUserDefaults.alloc().initWithSuiteName(pluginIdentifier);

export function getPreferences (key) {
    const userDefaults = NSUserDefaults.standardUserDefaults();
    if (!userDefaults.dictionaryForKey(pluginIdentifier)) {
        const defaultPreferences = NSMutableDictionary.alloc().init();
        userDefaults.setObject_forKey(defaultPreferences, pluginIdentifier);
        userDefaults.synchronize();
    }
    return userDefaults.dictionaryForKey(pluginIdentifier).objectForKey(key);
}

export function setPreferences (key, value) {
    const userDefaults = NSUserDefaults.standardUserDefaults();
    let preferences = null;
    if (!userDefaults.dictionaryForKey(pluginIdentifier)) {
        preferences = NSMutableDictionary.alloc().init();
    } else {
        preferences = NSMutableDictionary.dictionaryWithDictionary(userDefaults.dictionaryForKey(pluginIdentifier));
    }
    preferences.setObject_forKey(value, key);
    userDefaults.setObject_forKey(preferences, pluginIdentifier);
    userDefaults.synchronize();
}