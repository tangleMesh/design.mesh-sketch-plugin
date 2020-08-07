import { UI } from 'sketch'
import upload from "./upload.helper";
import { checkSynchronization } from "./credentials";
import { getPreferences, setPreferences } from "./storage.helper";



export function documentSaved (context) {
  const document = (context.document || context.actionContext.document);
  
  // TODO: check, if document has been set up to sync
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


export function enableDocumentSync (context) {
  // Check, if user has been logged in with credentials
  if (!checkSynchronization ()) {
    return;
  }

  const document = context.document;
  setPreferences (document.documentIdentifier (), "true");
  UI.message ("Enabled synchronization for this document! ⏯");
}

export function disableDocumentSync (context) {
  const document = context.document;
  setPreferences (document.documentIdentifier (), "null");
  UI.message ("Disabled synchronization for this document! ⏹");
}