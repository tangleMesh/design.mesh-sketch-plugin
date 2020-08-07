import { UI } from 'sketch'
import upload from "./upload.helper";
import { checkSynchronization } from "./credentials";
import { getPreferences, setPreferences } from "./storage.helper";


export function downloadLatestVersion () {
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
  log (filePath);

  // download new version of the document
  // TODO: Download the latest version!
  // upload (filePath)
  //   .then (response => {
  //     console.log (response);
  //     UI.message ("Synchronized with remote! 🙌");
  //   })
  //   .catch (() => UI.message ("Error: Could not synchronize! Please check your internet connection. 😳"));
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
  log (filePath);

  // upload new version of the document
  upload (filePath)
    .then (response => {
      console.log (response);
      UI.message ("Synchronized with remote! 🙌");
    })
    .catch (() => UI.message ("Error: Could not synchronize! Please check your internet connection. 😳"));
}

export function documentOpened (context) {
  const document = (context.document || context.actionContext.document);
  downloadLatestVersion (document);

  setInterval (() => {
    // TODO: initiate interval to poll for remote updates on the file, and download copy, if remote branch has been changed! (replace current local file and refresh ui)
    // TODO: show message, that you switched branch and upload latest local copy before to the old branch!
  }, 30000);
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

  const document = context.document;
  setPreferences (document.documentIdentifier (), "true");
  UI.message ("Enabled synchronization for this document! ⏯");

  // Upload the actual document
  documentSaved (context);
}

export function disableDocumentSync (context) {
  const document = context.document;
  setPreferences (document.documentIdentifier (), "null");
  UI.message ("Disabled synchronization for this document! ⏹");
}