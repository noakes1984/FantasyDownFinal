// @flow
import * as React from "react";
import {View, Image, StyleSheet} from "react-native";

import {Theme, Text} from "../../components";

type CityCardProps = {
    label: string,
    image: number
};

export default class CityCard extends React.Component<CityCardProps> {
    render(): React.Node {
        const {label, image} = this.props;
        return (
            <View style={styles.container}>
                <Image source={image} style={styles.image} />
                <Text type="large" gutterBottom={true} style={styles.text}>{label}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginRight: Theme.spacing.small
    },
    image: {
        width: 121,
        height: 121 * 1.67
    },
    text: {
        marginTop: Theme.spacing.tiny,
        marginLeft: Theme.spacing.tiny
    }
});
