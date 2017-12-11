// @flow
import {Asset} from "expo";

export default class Images {

    static cover = require("./cover.jpg");

    static downloadAsync(): Promise<*>[] {
        return [
            Asset.loadAsync(Images.cover)
        ];
    }
}
