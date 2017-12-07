const admin = require("firebase-admin");
const functions = require("firebase-functions");
const Cors = require("cors");
const express = require("express");
const multer = require("multer");
const upload = multer();

const api = express().use(Cors({ origin: true }));
admin.initializeApp(functions.config().firebase);

/*
{ picture:
   [ { fieldname: 'picture',
       originalname: 'picture.jpg',
       encoding: '7bit',
       mimetype: 'image/jpeg',
       buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 d8 00 d8 00 00 ff e1 00 8c 45 78 69 66 00 00 4d 4d 00 2a 00 00 00 08 00 05 01 12 00 03 00 00 00 01 00 01 ... >,
       size: 69572 } ],
  preview:
   [ { fieldname: 'preview',
       originalname: 'preview.jpg',
       encoding: '7bit',
       mimetype: 'image/jpeg',
       buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 48 00 48 00 00 ff e1 00 58 45 78 69 66 00 00 4d 4d 00 2a 00 00 00 08 00 02 01 12 00 03 00 00 00 01 00 01 ... >,
       size: 857 } ] }
*/

api.post("/picture", upload.single("picture"), function (req, response, next) {
    uploadImageToStorage(req.file)
    .then(uri => {
        response.status(200).json(uri);
        next();
    })
    .catch(error => {
        console.error(error);
        response.status(500).json({ error });
        next();
    });
});

exports.api = functions.https.onRequest(api);

const uploadImageToStorage = file => {
    return new Promise((resolve, reject) => {
        const fileUpload = admin.storage().bucket().file(file.originalname);
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: "image/jpg"
            }
        });

        blobStream.on("error", error => reject(error));

        blobStream.on("finish", () => {
            // The public URL can be used to directly access the file via HTTP.
            resolve({
                [file.originalname]:
                    `https://storage.googleapis.com/react-native-fiber.appspot.com/${file.originalname}`
            });
        });

    blobStream.end(file.buffer);
  });
}
