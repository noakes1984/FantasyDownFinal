// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View} from "react-native";

import {Text, NavigationHelpers} from "../../components";
import type {ScreenProps} from "../../components/Types";

export default class Profile extends React.Component<ScreenProps<>> {

    @autobind
    logOut() {
        const {navigation} = this.props;
        NavigationHelpers.reset(navigation, "Welcome");
    }

    render(): React.Node {
        return (
            <View>
                <Text type="header1">Profile</Text>
            </View>
        );
    }
}
