// @flow
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

    render(): React.Node {
        const {canOpen} = this.state;
        if (canOpen === null) {
            return (
                <View style={styles.container}>
                    <RefreshIndicator refreshing />
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <Text type="header3" gutterBottom style={styles.text}>Take Pictures with Fiber</Text>
                <Text gutterBottom style={styles.text}>
                    Allow access to your camera to start taking photos with Fiber.
                </Text>
                {
                    canOpen === true && (
                        <Button label="Enable Camera Access" primary full {...{onPress}} />
                    )
                }
                {
                    canOpen === false && (
                        <Text gutterBottom style={styles.text}>
                        Allow access to your camera in the app settings.
                        </Text>
                    )
                }
            </View>
        );
    }
}

const onPress = async (): Promise<void> => Linking.openURL("app-settings:");
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
