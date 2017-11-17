// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, View, TouchableWithoutFeedback} from "react-native";
import {List, ListItem, Body} from "native-base";

import Steps from "./Steps";

import  {HomeContainer} from "../Home";

import {Text, APIStore, Avatar, Theme, IconButton, NavigationHelpers} from "../../components";
import type {ScreenProps} from "../../components/Types";

export default class Profile extends React.Component<ScreenProps<>> {

    @autobind
    logOut() {
        const {navigation} = this.props;
        NavigationHelpers.reset(navigation, "Welcome");
    }

    @autobind
    settings() {
        const {navigation} = this.props;
        navigation.navigate("Settings");
    }

    render(): React.Node {
        const profile = APIStore.profile();
        return (
            <HomeContainer withGutter={true}>
                <TouchableWithoutFeedback>
                    <View style={styles.header}>
                        <View>
                            <Text type="header1">{profile.name}</Text>
                            <Text>View and Edit Profile</Text>
                        </View>
                        <Avatar uri={profile.picture} />
                    </View>
                </TouchableWithoutFeedback>
                <Steps stepsLeft={1} />
                <List>
                    <ListItem onPress={this.settings}>
                        <Body>
                            <Text>Settings</Text>
                        </Body>
                        <IconButton name="ios-settings-outline" onPress={this.settings} style={styles.btn} />
                    </ListItem>
                    <ListItem onPress={this.logOut}>
                        <Body>
                            <Text>Sign-Out</Text>
                        </Body>
                        <IconButton name="ios-log-out-outline" onPress={this.logOut} style={styles.btn} />
                    </ListItem>
                </List>
            </HomeContainer>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: Theme.spacing.base
    },
    btn: {
        flexDirection: "row",
        justifyContent: "flex-end"
    }
});
