// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, View, TouchableWithoutFeedback, Image} from "react-native";
import {ImagePicker} from "expo";
import {Content} from "native-base";

import {NavHeader, Firebase, Button, TextField, Theme, ImageUpload, serializeException} from "../../components";
import type {ScreenParams} from "../../components/Types";
import type {Profile} from "../../components/Model";
import type {Picture} from "../../components/ImageUpload";

type SettingsState = {
    name: string,
    picture: Picture,
    loading: boolean
};

export default class Settings extends React.Component<ScreenParams<{ profile: Profile }>, SettingsState> {

    componentWillMount() {
        const {navigation} = this.props;
        const {profile} = navigation.state.params;
        const picture = {
            uri: profile.picture.uri,
            height: 0,
            width: 0
        }
        this.setState({ name: profile.name, picture, loading: false });
    }

    @autobind
    logout() {
        Firebase.auth.signOut();
    }

    @autobind
    async save(): Promise<void> {
        const {navigation} = this.props;
        const originalProfile = navigation.state.params.profile;
        const {name, picture} = this.state;
        const {uid} = Firebase.auth.currentUser;
        this.setState({ loading: true });
        try {
            if (name !== originalProfile.name) {
                await Firebase.firestore.collection("users").doc(uid).update({ name });
            }
            if (picture.uri !== originalProfile.picture.uri) {
                const id = ImageUpload.uid();
                const name = `${id}.jpg`;
                const preview = await ImageUpload.preview(picture);
                await ImageUpload.upload(picture, name);
                const uri = await Firebase.storage.ref(name).getDownloadURL();
                await Firebase.firestore.collection("users").doc(uid).update({ picture: { preview, uri } });
            }
            navigation.goBack();
        } catch(e) {
            const message = serializeException(e);
            alert(message);
            this.setState({ loading: false });
        }
    }

    @autobind
    async setPicture(): Promise<void> {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });
        if (result.cancelled === false) {
            const {uri, width, height} = result;
            const picture: Picture = {
                uri,
                width,
                height
            };
            this.setState({ picture });
        }
    }

    @autobind
    setName(name: string) {
        this.setState({ name });
    }

    render(): React.Node {
        const {navigation} = this.props;
        const {name, picture, loading} = this.state;
        return (
            <View style={styles.container}>
                <NavHeader title="Settings" back={true} {...{navigation}} />
                <Content style={styles.content}>
                    <View style={styles.avatar}>
                        <TouchableWithoutFeedback onPress={this.setPicture}>
                            <View>
                                <Image style={styles.profilePic} source={{ uri: picture.uri }} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <TextField
                        placeholder="Name"
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="go"
                        defaultValue={name}
                        onSubmitEditing={this.save}
                        onChangeText={this.setName}
                    />
                    <Button label="Save" full={true} primary={true} onPress={this.save} {...{loading}} />
                    <Button label="Sign-Out" full={true} onPress={this.logout} />
                </Content>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        marginHorizontal: Theme.spacing.base
    },
    avatar: {
        marginVertical: Theme.spacing.base,
        alignItems: "center"
    },
    profilePic: {
        height: 100,
        width: 100,
        resizeMode: "cover",
        borderRadius: 50
    }
});
