// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, View} from "react-native";
import {List, ListItem, Body} from "native-base";

import {Container, NavHeader, Text, Switch, Theme} from "../../components";
import type {ScreenParams} from "../../components/Types";

export default class Settings extends React.Component<ScreenParams<{ currency: string }>> {

    @autobind
    currencies() {
        const {navigation} = this.props;
        const currency = navigation.state.params ? navigation.state.params.currency : "Euro (€)";
        navigation.navigate("Currencies", { currency });
    }

    render(): React.Node {
        const {navigation} = this.props;
        const currency = navigation.state.params ? navigation.state.params.currency : "Euro (€)";
        return (
            <Container>
                <NavHeader title="Settings" {...{ navigation }} />
                <View style={styles.container}>
                    <List>
                        <ListItem style={styles.listItem}>
                            <Body>
                                <Text>Notifications</Text>
                            </Body>
                            <Switch onTintColor={Theme.palette.primary} />
                        </ListItem>
                        <ListItem style={styles.listItem} onPress={this.currencies}>
                            <Body>
                                <Text>Currency</Text>
                            </Body>
                            <Text style={styles.currency}>{currency}</Text>
                        </ListItem>
                    </List>
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Theme.spacing.base
    },
    listItem: {
        height: 50
    },
    currency: {
        color: Theme.palette.primary
    }
});
