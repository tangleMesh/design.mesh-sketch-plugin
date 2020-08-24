import fs from "@skpm/fs";
import { generateSecurityHeaders } from "./credentials";


export function upload (filePath, identifier) {
    return new Promise ((resolve, reject) => {
        // Read file into buffer
        const fileBuffer = fs.readFileSync (filePath, {
            encoding: "buffer",
        });
        const fileBase64 = fileBuffer.toString ("base64");
        
        // upload file to server
        const { key } = generateSecurityHeaders ();
        fetch ("https://localhost:3000/upload", {
            method: "POST",
            body: fileBase64,
            headers: {
                "Content-Type": "application/base64",
                "X-DOCUMENT": identifier,
                "X-API-KEY": key,
            }
        })
            .then (response => resolve (response.text ()))
            .catch (error => {
                console.error ("file.helper.js", error);
                return reject (error)
            });
    });
};

export function download (filePath, identifier) {
    return new Promise ((resolve, reject) => {
        // download file
        const { key } = generateSecurityHeaders ();
        fetch ("https://localhost:3000/download", {
            method: "GET",
            headers: {
                "Content-Type": "application/base64",
                "X-DOCUMENT": identifier,
                "X-API-KEY": key,
            }
        })
            .then (response => {
                // write file into buffer
                const fileBuffer = Buffer.from (response.text ()._value, "base64");
                fs.writeFileSync (filePath, fileBuffer, {
                    encoding: "buffer",
                });
                resolve (true);
            })
            .catch (error => {
                console.error ("file.helper.js", error);
                return reject (error)
            });
    });
};