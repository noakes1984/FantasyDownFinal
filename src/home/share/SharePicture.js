// @flow
import moment from "moment";
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, TextInput, Image, Dimensions, View} from "react-native";
import {Content} from "native-base";

import {
    Container, NavHeader, Button, Theme, RefreshIndicator, Firebase, NavigationHelpers, ImageUpload, serializeException,
    Text
} from "../../components";

import type {ScreenParams} from "../../components/Types";
import type {Post} from "../../components/Model";
import type {Picture} from "../../components/ImageUpload";

type SharePictureState = {
    loadingLabel: string,
    loading: boolean,
    caption: string
};

export default class SharePicture extends React.Component<ScreenParams<Picture>, SharePictureState> {

    componentWillMount() {
        this.setState({ loading: false, loadingLabel: "", caption: "" });
    }

    @autobind
    async onPress(): Promise<void> {
        const {navigation} = this.props;
        const {caption} = this.state;
        const picture = navigation.state.params;
        this.setState({ loading: true });
        const id = ImageUpload.uid();
        const name = `${id}.jpg`;
        try {
            this.setState({ loadingLabel: "Building preview..." });
            const preview = await ImageUpload.preview(picture);
            this.setState({ loadingLabel: "Uploading picture..." });
            await ImageUpload.upload(picture, name);
            this.setState({ loadingLabel: "Fetching metadata..." });
            const url = await Firebase.storage.ref(name).getDownloadURL();
            this.setState({ loadingLabel: "Saving Post..." });
            const {uid} = Firebase.auth.currentUser;
            const post: Post = {
                id,
                uid,
                comments: 0,
                likes: [],
                timestamp: parseInt(moment().format("X"), 10),
                text: caption,
                picture: {
                    uri: url,
                    preview
                }
            };
            await Firebase.firestore.collection("feed").doc(id).set(post);
            NavigationHelpers.reset(navigation, "Home");
        } catch(e) {
            const message = serializeException(e);
            alert(message);
            this.setState({ loading: false });
        }
    }

    @autobind
    onChangeText(caption: string) {
        this.setState({ caption });
    }

    render(): React.Node {
        const {onPress, onChangeText} = this;
        const {navigation} = this.props;
        const {loading, loadingLabel} = this.state;
        const source = navigation.state.params;
        if (loading) {
            return (
                <View style={styles.loading}>
                    <RefreshIndicator />
                    <Text>{loadingLabel}</Text>
                </View>
            )
        }
        return (
            <Container>
                <NavHeader back={true} title="Share" {...{navigation}} />
                <Content>
                    <Image {...{ source }} style={styles.picture} />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Write Caption"
                        underlineColorAndroid="transparent"
                        onSubmitEditing={onPress}
                        {...{ onChangeText }}
                    />
                    <Button primary={true} full={true} label="Share Picture" {...{onPress}} style={styles.btn} />
                </Content>
            </Container>
        );
    }
}

const {width} = Dimensions.get("window");
const styles = StyleSheet.create({
    loading: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    container: {
        flexGrow: 1
    },
    picture: {
        width,
        height: width
    },
    textInput: {
        flexGrow: 1,
        padding: Theme.spacing.base,
        ...Theme.typography.regular
    },
    btn: {
        margin: Theme.spacing.base
    }
});
