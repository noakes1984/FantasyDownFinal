// @flow
import autobind from "autobind-decorator";

import * as React from "react";
import {StyleSheet, View, Linking} from "react-native";

import {Text, Button, Theme, RefreshIndicator} from "../../components";

type Props = {};
type State = {
    canOpen: boolean | null
};

export default class EnableCameraPermission extends React.Component<Props, State> {

    async componentWillMount(): Promise<void> {
        this.setState({ canOpen: null });
        const canOpen = await Linking.canOpenURL("app-settings:");
        this.setState({ canOpen });
    }

    @autobind
    async onPress(): Promise<void> {
        Linking.openURL("app-settings:");
    }

    render(): React.Node {
        const {onPress} = this;
        const {canOpen} = this.state;
        if (canOpen === null) {
            return (
                <View style={styles.container}>
                    <RefreshIndicator refreshing={true} />
                </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    <Text type="header3" gutterBottom={true} style={styles.text}>Take Pictures with Fiber</Text>
                    <Text gutterBottom={true} style={styles.text}>
                    Allow access to your camera roll to start taking photos with Fiber.
                    </Text>
                    {
                        canOpen === true && (
                            <Button label="Enable Camera Roll Access" primary={true} full={true} {...{onPress}} />
                        )
                    }
                    {
                        canOpen === false && (
                            <Text gutterBottom={true} style={styles.text}>
                            Allow access to your camera roll in the app settings.
                            </Text>
                        )
                    }
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        padding: Theme.spacing.base * 2
    },
    text: {
        textAlign: "center"
    }
});
