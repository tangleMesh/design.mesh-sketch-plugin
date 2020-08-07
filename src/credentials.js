import { UI } from 'sketch'

const credentialsKey = "api-key";

export function removeCredentials () {
    setPreferences (credentialsKey, "null");
    UI.message ("Your credentials have been successfully removed! 🔑");
}
import { getPreferences, setPreferences } from "./storage.helper";

export function addCredentials () {
    UI.getInputFromUser(
        "Please enter your api-key from your settings at https://design-mesh.com.",
        {
            initialValue: 'IEAAAKD29DS-38DJA…',
        },
        (err, value) => {
            if (err) {
                console.log ("credentials.js", err);
                return;
            }
            setPreferences (credentialsKey, value);
            userDefaults.synchronize();
            UI.message ("Your credentials have been successfully saved! 🔐");
        }
    );
}

export function getCredentials () {
    const credentialValue = getPreferences (credentialsKey);
    if (credentialValue === "null") {
        return null;
    }
    return credentialValue;
}

export function checkSynchronization () {
    const credentials = getCredentials ();
    if (credentials == "null") {
      UI.message ("You need to authenticate yourself before synchronizing the document! 🤓");
      return false;
    }
    return true;
}