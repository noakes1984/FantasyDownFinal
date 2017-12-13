// @flow
import {ImageEditor, ImageStore} from "react-native";

import Firebase from "./Firebase";

export type Picture = {
    uri: string,
    width: number,
    height: number
};

const previewParams = (width: number, height: number) => ({
    offset: {
        x: 0,
        y: 0
    },
    size: {
        width,
        height
    },
    displaySize: {
        width: 20,
        height: 20
    },
    resizeMode: "cover"
});

const id = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

export default class ImageUpload {

    static uid(): string {
        return id() + id() + "-" + id() + "-" + id() + "-" + id() + "-" + id() + id() + id();
    }

    static preview({ uri, width, height }: Picture): Promise<string> {
        return new Promise((resolve, reject) =>
            ImageEditor.cropImage(
                uri,
                previewParams(width, height),
                uri => ImageStore.getBase64ForTag(
                    uri, data => resolve(`data:image/jpeg;base64,${data}`), err => reject(err)
                ),
                err => reject(err)
            )
        );
    }

    static async upload(picture: Picture, name: string): Promise<void> {
        try {
            const body = new FormData();
            // $FlowFixMe
            body.append("picture", {
                uri: picture.uri,
                name,
                type: "image/jpg"
            });
            await fetch(`${Firebase.endpoint}/picture`, {
                method: "POST",
                body,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data"
                }
            });
        } catch(e) {
            alert(e);
        }
    }
}
