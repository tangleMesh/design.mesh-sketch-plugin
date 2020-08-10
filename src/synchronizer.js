import { UI } from "sketch";
const Document = require('sketch/dom').Document;
import { upload, download } from "./file.helper";
import { checkSynchronization, generateSecurityHeaders } from "./credentials";
import { getPreferences, setPreferences } from "./storage.helper";


export function downloadLatestVersion (document) {
  // check, if document has been set up to sync
  const documentSync = getPreferences (document.documentIdentifier ());
  if (documentSync != "true") {
    return;
  }

  // Check, if user has been logged in with credentials
  if (!checkSynchronization ()) {
    return;
  }

  // read location of the currently saved document
  const filePath = document.fileURL ().path ();
  const documentId = document.documentIdentifier ();

  // Download the latest version!
  download (filePath, documentId)
    .then (response => {
      // live reload the openend document to show latest changes!
      document.close ();
      Document.open (document.fileURL ());
      UI.message ("Synchronized with remote! 🙌");
    })
    .catch (() => UI.message ("Error: Could not synchronize! Please check your internet connection. 😳"));
}

export function uploadLatestVersion (document) {
  // check, if document has been set up to sync
  const documentSync = getPreferences (document.documentIdentifier ());
  if (documentSync != "true") {
    return;
  }

  // Check, if user has been logged in with credentials
  if (!checkSynchronization ()) {
    return;
  }

  // read location of the currently saved document
  const filePath = document.fileURL ().path ();
  const documentId = document.documentIdentifier ();

  // upload new version of the document
  upload (filePath, documentId)
    .then (response => {
      UI.message ("Synchronized with remote! 🙌");
    })
    .catch ((e) => UI.message ("Error: Could not synchronize! Please check your internet connection. 😳"));
}

export function documentOpened (context) {
  const document = (context.document || context.actionContext.document);
  downloadLatestVersion (document);

  // Check, if remotely the file has changed and a new update needs to be downloaded
  // initiate interval to poll for remote updates on the file, and download copy, if remote branch has been changed! (replace current local file and refresh ui)
  setInterval (() => {
    synchronizeDocument (context);
  }, 30000);
}

export function synchronizeDocument (context) {
  const document = (context.document || context.actionContext.document);
  // show message, that you switched branch and upload latest local copy before to the old branch!
  console.log ("HASH", document.hash ());
  const { userId, key } = generateSecurityHeaders ();
  fetch ("https://localhost:3000/status", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "X-DOCUMENT": document.documentIdentifier (),
        "X-USER": userId,
        "X-API-KEY": key,
    }
  })
    .then (response => {
      if (!response.json ()._value || !response.json ()._value.action) {
        throw new Error ("synchronizer.js: Unknown response from api!");
      }
      let showMessage = true;
      switch (response.json ()._value.action.toLowerCase ()) {
        case "download":
          downloadLatestVersion (document);
        break;
        case "upload":
          uploadLatestVersion (document);
        break;
        default:
          // Do nothing
          showMessage = false;
        }
        if (showMessage) {
          UI.message (response.json ()._value.message);
        }
    })
    .catch (() => UI.message ("Error: Could not synchronize! Please check your internet connection. 😳"));
}

export function documentSaved (context) {
  const document = (context.document || context.actionContext.document);
  uploadLatestVersion (document);
}

export function enableDocumentSync (context) {
  // Check, if user has been logged in with credentials
  if (!checkSynchronization ()) {
    return;
  }

  // Set document-id to by synced
  const document = context.document;
  setPreferences (document.documentIdentifier (), "true");

  // Upload the actual document
  uploadLatestVersion (context);

  UI.message ("Enabled synchronization for this document! ⏯");
}

export function disableDocumentSync (context) {
  const document = context.document;
  setPreferences (document.documentIdentifier (), "null");
  UI.message ("Disabled synchronization for this document! ⏹");
}