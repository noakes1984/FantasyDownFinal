import React, { Component } from "react";
import {
    // Alert,
    // TouchableOpacity,
    AppRegistry,
    StyleSheet,
    View
    // TextInput
} from "react-native";
import {
    // Container,
    Button,
    // Header,
    // Content,
    Accordion,
    Text,
    // StyleProvider
    Item,
    Input
    // Footer,
    // FooterTab,
    // Textarea,
    // Spinner
} from "native-base";
import getTheme from "../../native-base-theme/components";
import branch, { BranchEvent } from "react-native-branch";

import Schedule from '../Schedule';

// type Props = {};

export default class BetView extends Component {
    state = {};

    constructor(props) {
        super(props);

        this.state = {
            screen: "bet",
            isGeneratingBet: false,
            visibleModal: 1,

            events: Schedule.ss.gms[0].g.map((event) => { return {title: event, content: event}; }),

            //wallet: null,
        };

        this.selectTeam = this.selectTeam.bind(this);
        this.generateBet = this.generateBet.bind(this);
        this._renderSectionTitle = this._renderSectionTitle.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.renderContent = this.renderContent.bind(this);
    }

    componentWillMount() {
        console.log("BetView Class is running");
    }

    async componentDidMount() {
        console.log("BetView Class is running");


        // populate games array so it works with native-base accordion

        console.log(this.games);

        // branch.subscribe(({ error, params }) => {
        //     if (error) {
        //         console.error("Error from Branch: " + error);
        //         return;
        //     }
        //
        //     // params will never be null if error is null
        //
        //     if (params["+non_branch_link"]) {
        //         const nonBranchUrl = params["+non_branch_link"];
        //         // Route non-Branch URL if appropriate.
        //         return;
        //     }
        //
        //     if (!params["+clicked_branch_link"]) {
        //         // Indicates initialization success and some other conditions.
        //         // No link was opened.
        //         return;
        //     }
        //
        //     console.log(params);
        //
        //     let eventId = parseInt(params.id);
        //     console.log("eventId", eventId);
        //     let event = this.state.events.filter(event => event.id === eventId)[0];
        //     console.log("event", event);
        //     let openChoice = event.content.teamHome === params.choice ? event.content.teamAway : event.content.teamHome;
        //     console.log("openChoice", openChoice);
        //     let message =
        //         "Would you like to bet on " +
        //         openChoice +
        //         " for the event " +
        //         event.title +
        //         " for " +
        //         params.amount +
        //         " Coins?";
        //     console.log("message", message);
        //
        //     Alert.alert(
        //         "FantasyBet",
        //         message,
        //         [
        //             { text: "Cancel", onPress: () => console.log("Cancel Pressed"), style: "cancel" },
        //             {
        //                 text: "OK",
        //                 onPress: () => {
        //                     console.log("this.generateBet(params.id, openChoice, params.amount);");
        //                 }
        //             }
        //         ],
        //         { cancelable: false }
        //     );
        // });
    }

    selectTeam = (event, team) => {
        console.log('event', event);
        console.log('team', team);
        let events = this.state.events.map(el => {
            if (el.content['-eid'] === event['-eid']) {
                return { ...el, content: { ...el.content, selected: team } };
            }

            return el;
        });

        console.log('state', this.state);

        this.setState({
            events: events
        });
    };

    generateBet = async (eventId, choice, amount, createDeepLink = false) => {
        // this.setState({ generatingBet: true });
        // if (createDeepLink) {
        //     // only canonicalIdentifier is required
        //     let branchUniversalObject = await branch.createBranchUniversalObject("canonicalIdentifier", {
        //         locallyIndex: true,
        //         title: "Fantasy Bet",
        //         contentDescription: "Cool Content Description",
        //         contentMetadata: {
        //             customMetadata: {
        //                 id: eventId.toString(),
        //                 choice: choice,
        //                 amount: amount,
        //                 contractAddress: "Hello"
        //             }
        //         }
        //     });
        //
        //     let shareOptions = { messageHeader: "Fantasy Bet", messageBody: "Somebody wants to make a bet!" };
        //     let linkProperties = { feature: "share", channel: "RNApp" };
        //     let controlParams = { $desktop_url: "http://fantasydown.com/bet", $ios_url: "http://fantasydown.com/bet" };
        //     let { channel, completed, error } = await branchUniversalObject.showShareSheet(
        //         shareOptions,
        //         linkProperties,
        //         controlParams
        //     );
        // }
        //
        // this.setState({ isGeneratingBet: false });
    };

    _renderSectionTitle(event) {
        return <View style={styles.content}>{/*<Text>{event.content}</Text>*/}</View>;
    }

    renderHeader(title, expanded) {
        return (
            <View style={styles.header}>
                <Text style={styles.headerText}>{title['-hnn'].capitalize()} vs {title['-vnn'].capitalize()}</Text>
            </View>
        );
    }

    renderContent(event) {
        console.log('renderContent event', event);

        let teamHomeColor = "#dddddd";
        let teamAwayColor = "#dddddd";
        let teamHomeText = "#000000";
        let teamAwayText = "#000000";
        if (event.selected === event['-h']) {
            teamHomeColor = "lightgreen";
            teamHomeText = "#ffffff";
        }
        if (event.selected === event['-v']) {
            teamAwayColor = "lightblue";
            teamAwayText = "#ffffff";
        }

        return (
            <View
                style={[
                    styles.content,
                    {
                        backgroundColor: "lightgray",
                        flexDirection: "column",
                        padding: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: "#eeeeee"
                    }
                ]}
            >
                <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 1, marginBottom: 30, marginRight: 5 }}>
                        <Button
                            style={{ backgroundColor: teamHomeColor }}
                            onPress={() => this.selectTeam(event, event['-h'])}
                            light
                            block
                        >
                            <Text style={{ color: teamHomeText }}>{event['-h']}</Text>
                        </Button>
                    </View>
                    <View style={{ flex: 1, marginBottom: 30, marginLeft: 5 }}>
                        <Button
                            style={{ backgroundColor: teamAwayColor }}
                            onPress={() => this.selectTeam(event, event['-v'])}
                            light
                            block
                        >
                            <Text style={{ color: teamAwayText }}>{event['-v']}</Text>
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
                                backgroundColor="white"
                            />
                        </Item>
                        <Text>Coins</Text>
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
        return (
            <View style={[styles.container]}>
                <View style={styles.coinsHeader}>
                    <Text style={{textAlign: "center"}}>Coins: 500</Text>
                </View>
                <Accordion
                    style={{ flex: 1 }}
                    dataArray={this.state.events}
                    renderHeader={this.renderHeader}
                    renderContent={this.renderContent}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "stretch",
        marginTop: 30,
        marginBottom: 30
    },
    coinsHeader: {
        alignSelf: "stretch",
        backgroundColor: "white",
        padding: 10,
    },
    header: {
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#eeeeee",
        padding: 20,
        alignSelf: 'stretch',
    },
    headerText: {
        fontSize: 24
    },
    button: {
        backgroundColor: "lightblue",
        padding: 12,
        margin: 16,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
    },
    modalContent: {
        backgroundColor: "white",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
    },
    content: {
        flexDirection: "row"
    }
});

module.exports = BetView;
