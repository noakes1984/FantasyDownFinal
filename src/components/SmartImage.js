// @flow
import * as _ from "lodash";
import * as React from "react";
import {Image, Animated, StyleSheet, View, Platform, ActivityIndicator} from "react-native";
import {BlurView, FileSystem} from "expo";
import SHA1 from "crypto-js/sha1";
import {observable, computed} from "mobx";
import {observer} from "mobx-react/native";

import type {BaseProps} from "./Types";

type Listener = () => mixed;

class DownloadManager {

    listeners: { [path: string]: Listener[] } = {};

    async download(uri: string, path: string, listener: Listener): Promise<void> {
        if (!this.listeners[path]) {
            this.listeners[path] = [listener];
            await FileSystem.downloadAsync(uri, path);
            this.listeners[path].forEach(listener => listener());
            delete this.listeners[path];
        } else {
            this.listeners[path].push(listener);
        }
    }

    listen(path: string, listener: Listener) {
        if (!this.listeners[path]) {
            listener();
        } else {
            this.listeners[path].push(listener);
        }
    }
}

type SmartImageProps = BaseProps & {
    preview?: string,
    uri: string,
    showSpinner?: boolean
};

const propsToCopy = [
    "borderRadius", "borderBottomLeftRadius", "borderBottomRightRadius", "borderTopLeftRadius", "borderTopRightRadius"
];

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

@observer
export default class SmartImage extends React.Component<SmartImageProps> {

    static defaultProps = {
        showSpinner: true
    };

    static downloadManager: DownloadManager = new DownloadManager();

    @observable _uri: string;
    @observable _intensity: Animated.Value = new Animated.Value(100);

    @computed get uri(): string { return this._uri; }
    set uri(uri: string) { this._uri = uri }

    @computed get intensity(): Animated.Value { return this._intensity; }
    set intensity(intensity: Animated.Value) { this._intensity = intensity; }

    async componentWillMount(): Promise<void> {
        const {preview, uri} = this.props;
        if (preview && Platform.OS === "ios") {
            this.uri = preview;
        }
        const entry = await getCacheEntry(uri);
        if (!entry.exists) {
            if (uri.startsWith("file://")) {
                await FileSystem.copyAsync({ from: uri, to: entry.path });
                this.uri = entry.path;
            } else {
                SmartImage.downloadManager.download(uri, entry.path, () => this.uri = entry.path);
            }
        } else {
            SmartImage.downloadManager.listen(entry.path, () => this.uri = entry.path);
        }
    }

    onLoadEnd(uri: string) {
        const {preview} = this.props;
        const isPreview = uri === preview;
        if (!isPreview && Platform.OS === "ios") {
            this.intensity = new Animated.Value(100);
            Animated.timing(this.intensity, { duration: 300, toValue: 0, useNativeDriver: true }).start();
        }
    }

    render(): React.Node {
        const {style, showSpinner} = this.props;
        const {uri, intensity} = this;
        const computedStyle = [
            StyleSheet.absoluteFill,
            _.pickBy(StyleSheet.flatten(style), (value, key) => propsToCopy.indexOf(key) !== -1)
        ];
        const spinnerStyle = { justifyContent: "center", alignItems: "center", backgroundColor: "#BFBFBF" };
        return (
            <View {...{style}}>
                {
                    uri && (
                        <Image
                            source={{ uri }}
                            resizeMode="cover"
                            style={computedStyle}
                            onLoadEnd={() => this.onLoadEnd(uri)}
                        />
                    )
                }
                {
                    (Platform.OS !== "ios" && !uri && showSpinner) && (
                        <View style={[computedStyle, spinnerStyle]}>
                            <ActivityIndicator size="large" color="white" />
                        </View>
                    )
                }
                {
                    Platform.OS === "ios" && <AnimatedBlurView tint="default" style={computedStyle} {...{intensity}} />
                }
            </View>
        );
    }
}

const getCacheEntry = async(uri): Promise<{ exists: boolean, path: string }> => {
    const ext = uri.substring(uri.lastIndexOf("."), uri.indexOf("?") === -1 ? undefined : uri.indexOf("?"));
    const path = FileSystem.cacheDirectory + SHA1(uri) + ext;
    const info = await FileSystem.getInfoAsync(path);
    const {exists} = info;
    return { exists, path };
}
