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

// type Props = {};

export default class BetView extends Component {
    state = {};

    constructor(props) {
        super(props);

        this.state = {
            screen: "bet",
            isGeneratingBet: false,
            visibleModal: 1,

            //wallet: null,

            events: [
                {
                    id: 1,
                    title: "Vikings vs Rams",
                    content: {
                        id: 1,
                        title: "Vikings vs Rams",
                        teamHome: "Vikings",
                        teamAway: "Rams"
                    }
                },
                {
                    id: 2,
                    title: "Texans vs Colts",
                    content: {
                        id: 2,
                        title: "Texans vs Colts",
                        teamHome: "Texans",
                        teamAway: "Colts"
                    }
                },
                {
                    id: 3,
                    title: "Bills vs Packers",
                    content: {
                        id: 3,
                        title: "Bills vs Packers",
                        teamHome: "Bills",
                        teamAway: "Packers"
                    }
                },
                {
                    id: 4,
                    title: "Buccaneers vs Bears",
                    content: {
                        id: 4,
                        title: "Buccaneers vs Bears",
                        teamHome: "Buccaneers",
                        teamAway: "Bears"
                    }
                },
                {
                    id: 5,
                    title: "Dolphins vs Patriots",
                    content: {
                        id: 5,
                        title: "Dolpins vs Patriots",
                        teamHome: "Dolphins",
                        teamAway: "Patriots"
                    }
                },
                {
                    id: 6,
                    title: "Lions vs Cowboys",
                    content: {
                        id: 6,
                        title: "Lions vs Cowboys",
                        teamHome: "Lions",
                        teamAway: "Cowboys"
                    }
                },
                {
                    id: 7,
                    title: "Bengals vs Falcons",
                    content: {
                        id: 7,
                        title: "Bengals vs Falcons",
                        teamHome: "Bengals",
                        teamAway: "Falcons"
                    }
                },
                {
                    id: 8,
                    title: "Jets vs Jaguars",
                    content: {
                        id: 8,
                        title: "Jets vs Jaguars",
                        teamHome: "Jets",
                        teamAway: "Jaguars"
                    }
                },
                {
                    id: 9,
                    title: "Eagles vs Titans",
                    content: {
                        id: 9,
                        title: "Eagles vs Titans",
                        teamHome: "Eagles",
                        teamAway: "Titans"
                    }
                },
                {
                    id: 10,
                    title: "Browns vs Raiders",
                    content: {
                        id: 10,
                        title: "Browns vs Raiders",
                        teamHome: "Browns",
                        teamAway: "Raiders"
                    }
                },
                {
                    id: 11,
                    title: "Seahawks vs Cardinals",
                    content: {
                        id: 11,
                        title: "Seahawks vs Cardinals",
                        teamHome: "Seahawks",
                        teamAway: "Cardinals"
                    }
                },
                {
                    id: 12,
                    title: "Saints vs Giants",
                    content: {
                        id: 12,
                        title: "Saints vs Giants",
                        teamHome: "Saints",
                        teamAway: "Giants"
                    }
                },
                {
                    id: 13,
                    title: "49ers vs Chargers",
                    content: {
                        id: 13,
                        title: "49ers vs Chargers",
                        teamHome: "49ers",
                        teamAway: "Chargers"
                    }
                },
                {
                    id: 14,
                    title: "Ravens vs Steelers",
                    content: {
                        id: 13,
                        title: "Ravens vs Steelers",
                        teamHome: "Ravens",
                        teamAway: "Steelers"
                    }
                },
                {
                    id: 14,
                    title: "Chiefs vs Broncos",
                    content: {
                        id: 14,
                        title: "Chiefs vs Broncos",
                        teamHome: "Chiefs",
                        teamAway: "Broncos"
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
        console.log("BetView Class is running");
    }

    async componentDidMount() {
        console.log("BetView Class is running");

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
                " Coins?";
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
                        contractAddress: "Hello"
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
            teamHomeColor = "lightgreen";
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
                        <BetView />
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
        alignItems: "center"
    },
    header: {
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#eeeeee",
        padding: 20
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
