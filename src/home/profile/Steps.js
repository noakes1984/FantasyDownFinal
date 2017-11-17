// @flow
import * as React from "react";
import {StyleSheet, View} from "react-native";

import {Text, Theme} from "../../components";

type StepsProps = {
    stepsLeft: 1 | 2 | 3 | 4 | 5
};

export default class Steps extends React.Component<StepsProps> {

    render(): React.Node {
        const {stepsLeft} = this.props;
        return (
            <View>
                <Text gutterBottom={true}>{`${stepsLeft} step${stepsLeft > 1 ? "s": ""} left`}</Text>
                <View style={styles.blocks}>
                    <View
                        style={[styles.block, styles.firstBlock, stepsLeft <= 4 ? styles.done : styles.notDone ]}
                    />
                    <View
                        style={[styles.block, styles.trailingBlock, stepsLeft <= 3 ? styles.done : styles.notDone ]}
                    />
                    <View
                        style={[styles.block, styles.trailingBlock, stepsLeft <= 2 ? styles.done : styles.notDone ]}
                    />
                    <View
                        style={[styles.block, styles.trailingBlock, stepsLeft <= 1 ? styles.done : styles.notDone ]}
                    />
                    <View style={[styles.block, styles.trailingBlock, styles.lastBlock, styles.notDone]} />
                </View>
                <View style={styles.lastRow}>
                    <Text type="regular">{messages[stepsLeft - 1]}</Text>
                </View>
            </View>
        );
    }
}

const messages: [string, string, string, string, string] = [
    "This last step is a fun one",
    "We need a bit more information",
    "Your profile is almost complete",
    "Couple more steps and we are good to go!",
    "Please fill-in your profile"
];

const styles = StyleSheet.create({
    container: {

    },
    blocks: {
        flexDirection: "row",
        flexShrink: 1
    },
    block: {
        flex: 1,
        height: 50
    },
    trailingBlock: {
        marginLeft: Theme.spacing.tiny
    },
    firstBlock: {
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4
    },
    lastBlock: {
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4
    },
    done: {
        backgroundColor: Theme.palette.secondary
    },
    notDone: {
        backgroundColor: Theme.palette.lightGray
    },
    lastRow: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1
    }
});
