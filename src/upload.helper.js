import fs from "@skpm/fs";

export default function (filePath, identifier) {
    return new Promise ((resolve, reject) => {
        // Read file into buffer
        const fileBuffer = fs.readFileSync (filePath, {
            encoding: "buffer",
        });
        const fileBase64 = fileBuffer.toString ("base64");
        
        fetch ("https://localhost:3000/upload", {
            method: "POST",
            body: fileBase64,
            headers: {
                "Content-Type": "application/base64",
            }
        //   headers: headers
        })
            .then (response => resolve (response.text ()))
            .catch (error => {
                console.error ("upload.helper.js", error);
                return reject (error)
            });
    });
    
};