// @flow
import {ImageManipulator} from "expo";

import Firebase from "./Firebase";

export type Picture = {
    uri: string,
    width: number,
    height: number
};

const {manipulate} = ImageManipulator;
const id = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

export default class ImageUpload {

    static uid(): string {
        return id() + id() + "-" + id() + "-" + id() + "-" + id() + "-" + id() + id() + id();
    }

    static async preview({ uri }: Picture): Promise<string> {
        const result = await manipulate(uri, [{ resize: { width: 10, height: 10 }}], { base64: true });
        return `data:image/jpeg;base64,${result.base64 || ""}`;
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
            const res = await fetch(`${Firebase.endpoint}/picture`, {
                method: "POST",
                body,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data"
                }
            });
            if (res.status !== 200) {
                // eslint-disable-next-line no-console
                console.error(res);
                throw new Error("An error happened when uploading the picture. Please try again.");
            }
        } catch(e) {
            alert(e);
        }
    }
}
