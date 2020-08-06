import sketch from 'sketch'
import upload from "./upload.helper";

export function documentSaved (context) {
  // read location of the currently saved document
  const filePath = context.actionContext.document.fileURL ().path ();
  log (filePath);

  // upload new version of the document
  upload (filePath)
    .then (response => {
      console.log (response);
      sketch.UI.message ("File uploaded! 🙌");
    })
    .catch (() => sketch.UI.message ("Error: File not uploaded! :("));
}