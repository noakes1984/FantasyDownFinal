// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {StyleSheet, View} from "react-native";
import {List, ListItem, Body, Radio} from "native-base";

import {Container, NavHeader, Theme, Text, Button} from "../../components";

import type {ScreenParams} from "../../components/Types";

type CurrenciesState = {
    currency: string
};

export default class Currencies extends React.Component<ScreenParams<CurrenciesState>, CurrenciesState> {

    componentWillMount() {
        const {currency} = this.props.navigation.state.params;
        this.setState({ currency });
    }

    @autobind
    save() {
        const {navigation} = this.props;
        const {currency} = this.state;
        navigation.navigate("Settings", { currency });
    }

    currency(currency: string) {
        this.setState({ currency });
    }

    render(): React.Node {
        const {navigation} = this.props;
        const {currency} = this.state;
        return (
            <Container>
                <NavHeader title="Currencies" {...{ navigation }} />
                <View style={styles.container}>
                    <List>
                    {
                        currencies.map(cur => (
                            <ListItem key={cur.flag} style={styles.listItem} onPress={() => this.currency(cur.label)}>
                                <Text style={styles.flag}>{cur.flag}</Text>
                                <Body>
                                    <Text>{cur.label}</Text>
                                </Body>
                                <Radio selected={currency === cur.label}  onPress={() => this.currency(cur.label)} />
                            </ListItem>
                        ))
                    }
                    </List>
                </View>
                <Button label="Save" onPress={this.save} style={styles.save} />
            </Container>
        );
    }
}

const currencies = [
    { flag: "🇪🇺", label: "Euro (€)" },
    { flag: "🇨🇭", label: "Swiss franc (CHF)"},
    { flag: "🇨🇦", label: "Canadian dollar ($)" },
    { flag: "🇬🇧", label: "Pound sterling (£)" },
    { flag: "🇮🇳", label: "Indian rupee (₹)" }
];

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Theme.spacing.base
    },
    flag: {
        marginRight: Theme.spacing.base
    },
    listItem: {
        height: 50
    },
    save: {
        position: "absolute",
        bottom: 0,
        right: Theme.spacing.base
    }
});
