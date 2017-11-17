// @flow
import * as React from "react";
import {StyleSheet, Image} from "react-native";
import SHA1 from "crypto-js/sha1";
import { FileSystem } from "expo";

import type {BaseProps} from "./Types";

type AvatarProps = BaseProps & {
    uri: string
};

type ImageCacheState = {
    uri?: string
};

export default class Avatar extends React.Component<AvatarProps, ImageCacheState> {

    static SIZE = 50;

    async componentWillMount(): Promise<void> {
        this.setState({});
        const {uri} = this.props;
        const cachedURI = await cacheImage(uri);
        this.setState({ uri: cachedURI });
    }

    render(): React.Node {
        const {style} = this.props;
        const {uri} = this.state;
        return <Image source={{ uri }} style={[style, styles.image]} />;
    }
}

const styles = StyleSheet.create({
    image: {
        height: Avatar.SIZE,
        width: Avatar.SIZE,
        borderRadius: Avatar.SIZE / 2
    }
});

const cacheImage = async(uri: string): Promise<string> => {
    const ext = uri.substring(uri.lastIndexOf("."), uri.indexOf("?") === -1 ? undefined : uri.indexOf("?"));
    const path = FileSystem.cacheDirectory + SHA1(uri) + ext;
    const info = await FileSystem.getInfoAsync(path);
    if (!info.exists) {
        await FileSystem.downloadAsync(uri, path);
    }
    return path;
};
