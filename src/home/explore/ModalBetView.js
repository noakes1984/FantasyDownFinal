import React, { Component } from "react";
import { Alert, TouchableOpacity, Platform, StyleSheet, View, TextInput } from "react-native";
import {
    Container,
    Button,
    Header,
    Content,
    Accordion,
    Text,
    StyleProvider,
    Item,
    Input,
    Footer,
    FooterTab,
    Textarea,
    Spinner
} from "native-base";
import getTheme from "../../../native-base-theme/components";
import branch, { BranchEvent } from "react-native-branch";

type Props = {};

export default class App extends Component<Props> {
    constructor(props) {
        super(props);
        console.log("ModalBetView is running");
        this.state = {
            screen: "bet",
            isGeneratingBet: false,

            //wallet: null,

            events: [
                {
                    id: 1,
                    title: "Falcons vs Eagles",
                    content: {
                        id: 1,
                        title: "Falcons vs Eagles",
                        teamHome: "Falcons",
                        teamAway: "Eagles"
                    }
                },
                {
                    id: 2,
                    title: "Bengals vs Colts",
                    content: {
                        id: 2,
                        title: "Bengals vs Colts",
                        teamHome: "Bengals",
                        teamAway: "Colts"
                    }
                },
                {
                    id: 3,
                    title: "Bills vs Ravens",
                    content: {
                        id: 3,
                        title: "Bills vs Ravens",
                        teamHome: "Bills",
                        teamAway: "Ravens"
                    }
                },
                {
                    id: 4,
                    title: "Bears vs Packers",
                    content: {
                        id: 4,
                        title: "Bears vs Packers",
                        teamHome: "Bears",
                        teamAway: "Packers"
                    }
                }
            ]
        };

        this.selectTeam = this.selectTeam.bind(this);
        this.generateBet = this.generateBet.bind(this);
        this._renderSectionTitle = this._renderSectionTitle.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.renderContent = this.renderContent.bind(this);
    }

    componentWillMount() {
        console.log("");
    }

    async componentDidMount() {
        branch.subscribe(({ error, params }) => {
            if (error) {
                console.error("Error from Branch: " + error);
                return;
            }

            // params will never be null if error is null

            if (params["+non_branch_link"]) {
                const nonBranchUrl = params["+non_branch_link"];
                // Route non-Branch URL if appropriate.
                return;
            }

            if (!params["+clicked_branch_link"]) {
                // Indicates initialization success and some other conditions.
                // No link was opened.
                return;
            }

            console.log(params);

            let eventId = parseInt(params.id);
            console.log("eventId", eventId);
            let event = this.state.events.filter(event => event.id === eventId)[0];
            console.log("event", event);
            let openChoice = event.content.teamHome === params.choice ? event.content.teamAway : event.content.teamHome;
            console.log("openChoice", openChoice);
            let message =
                "Would you like to bet on " +
                openChoice +
                " for the event " +
                event.title +
                " for " +
                params.amount +
                " ether?";
            console.log("message", message);

            Alert.alert(
                "FantasyBet",
                message,
                [
                    { text: "Cancel", onPress: () => console.log("Cancel Pressed"), style: "cancel" },
                    {
                        text: "OK",
                        onPress: () => {
                            console.log("this.generateBet(params.id, openChoice, params.amount);");
                        }
                    }
                ],
                { cancelable: false }
            );
        });
    }

    selectTeam = (event, team) => {
        let events = this.state.events.map(el => {
            if (el.title === event.title) {
                return { ...el, content: { ...el.content, selected: team } };
            }

            return el;
        });

        this.setState({
            events: events
        });
    };

    generateBet = async (eventId, choice, amount, createDeepLink = false) => {
        this.setState({ generatingBet: true });

        console.log("contract");

        console.log("something");

        if (createDeepLink) {
            // only canonicalIdentifier is required
            let branchUniversalObject = await branch.createBranchUniversalObject("canonicalIdentifier", {
                locallyIndex: true,
                title: "Fantasy Bet",
                contentDescription: "Cool Content Description",
                contentMetadata: {
                    customMetadata: {
                        id: eventId.toString(),
                        choice: choice,
                        amount: amount,
                        contractAddress: ""
                    }
                }
            });

            let shareOptions = { messageHeader: "Fantasy Bet", messageBody: "Somebody wants to make a bet!" };
            let linkProperties = { feature: "share", channel: "RNApp" };
            let controlParams = { $desktop_url: "http://fantasydown.com/bet", $ios_url: "http://fantasydown.com/bet" };
            let { channel, completed, error } = await branchUniversalObject.showShareSheet(
                shareOptions,
                linkProperties,
                controlParams
            );
        }

        this.setState({ isGeneratingBet: false });
    };

    retrieveBalancePressed = async () => {
        console.log("this.state.mnemonic", this.state.mnemonic);
        let address = this.getAddressFromMnemonic(this.state.mnemonic);
        let balance = await this.getBalance(address);

        this.web3.eth.call(
            {
                to: "tokenContractAddress"
                // data: contractData
            },
            function(err, result) {
                if (result) {
                    let tokens = "This.web3.utils.toBN(result).toString()";
                    console.log("tokens");
                    console.log("Tokens Owned: ");
                } else {
                    console.log(err); // Dump errors here
                }
            }
        );
    };

    _renderSectionTitle(event) {
        return <View style={styles.content}>{/*<Text>{event.content}</Text>*/}</View>;
    }

    renderHeader(title, expanded) {
        return (
            <View style={styles.header}>
                <Text style={styles.headerText}>{title}</Text>
            </View>
        );
    }

    renderContent(event) {
        let teamHomeColor = "#dddddd";
        let teamAwayColor = "#dddddd";
        let teamHomeText = "#000000";
        let teamAwayText = "#000000";
        if (event.selected === event.teamHome) {
            teamHomeColor = "lightgray";
            teamHomeText = "#ffffff";
        }
        if (event.selected === event.teamAway) {
            teamAwayColor = "lightblue";
            teamAwayText = "#ffffff";
        }

        return (
            <View
                style={[
                    styles.content,
                    { flexDirection: "column", padding: 10, borderBottomWidth: 1, borderBottomColor: "#eeeeee" }
                ]}
            >
                <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 1, marginBottom: 30, marginRight: 5 }}>
                        <Button
                            style={{ backgroundColor: teamHomeColor }}
                            onPress={() => this.selectTeam(event, event.teamHome)}
                            light
                            block
                        >
                            <Text style={{ color: teamHomeText }}>{event.teamHome}</Text>
                        </Button>
                    </View>
                    <View style={{ flex: 1, marginBottom: 30, marginLeft: 5 }}>
                        <Button
                            style={{ backgroundColor: teamAwayColor }}
                            onPress={() => this.selectTeam(event, event.teamAway)}
                            light
                            block
                        >
                            <Text style={{ color: teamAwayText }}>{event.teamAway}</Text>
                        </Button>
                    </View>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Item regular style={{ width: 100 }}>
                            <Input
                                placeholder="Amount"
                                value={this.state.amount}
                                onChangeText={amount => this.setState({ amount: amount })}
                                keyboardType="numeric"
                            />
                        </Item>
                        <Text> Coins</Text>
                    </View>
                    {!this.state.isGeneratingBet && (
                        <Button
                            onPress={() => this.generateBet(event.id, event.selected, this.state.amount, true)}
                            primary
                            disabled={!(event.selected && this.state.amount)}
                        >
                            <Text>Generate Bet</Text>
                        </Button>
                    )}
                    {this.state.isGeneratingBet && <Spinner color="blue" />}
                </View>
            </View>
        );
    }

    render() {
        console.log(this.state.screen);
        return (
            <View style={[styles.container]}>
                <StyleProvider style={getTheme()}>
                    <Container style={{ flex: 1, alignSelf: "stretch" }}>
                        <Header />
                        <Content>
                            {this.state.screen === "bet" && (
                                <Accordion
                                    style={{ flex: 1 }}
                                    dataArray={this.state.events}
                                    // renderHeader={this.renderHeader}
                                    renderContent={this.renderContent}
                                />
                            )}
                        </Content>
                    </Container>
                </StyleProvider>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: "#eeeeee",
        padding: 20
    },
    headerText: {
        fontSize: 24
    },
    content: {
        flexDirection: "row"
    }
});
