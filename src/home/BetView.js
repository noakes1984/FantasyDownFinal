import React, { Component } from "react";
import {
    // Alert,
    //TouchableOpacity,
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
    //Text,
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
import moment from "moment";
import * as firebase from "firebase";

//import { Feather as Icon } from "@expo/vector-icons";

//import { Theme } from "../components/Theme";
import Schedule from "../Schedule";
import { Card } from "react-native-elements"; // 0.19.1
import { Text, Theme, Avatar, Feed, FeedStore, ImageUpload, Firebase } from "../components";
import type { ScreenProps } from "../components/Types";
import type { Post } from "../components/Model";
//import type { Picture } from "../components/ImageUpload";
var uuid = require('react-native-uuid');


import { Feather as Icon } from "@expo/vector-icons";

// type Props = {};

export default class BetView extends Component {
    state = {};

    id: string;
    homeTeam: string;
    awayTeam: string;
    amount: string;

    constructor(props) {
        super(props);

        this.state = {
            screen: "bet",
            isGeneratingBet: false,
            visibleModal: 1,
            events: Schedule.ss.gms[0].g.map(event => {
                return { title: event, content: event };
            })
        };

        this.selectTeam = this.selectTeam.bind(this);
        this.generateBet = this.generateBet.bind(this);
        this._renderSectionTitle = this._renderSectionTitle.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.renderContent = this.renderContent.bind(this);
    }

    async componentDidMount() {
        //console.log("BetView Class is running");
        // populate games array so it works with native-base accordion
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
        console.log("event Object deez nuts", event);
        console.log("team", team);
        let events = this.state.events.map(el => {
            if (el.content["-eid"] === event["-eid"]) {
                console.log("El return: ", el);

                return { ...el, content: { ...el.content, selected: team } };
            }
            return el;
        });

        console.log("state", this.state);

        this.setState({
            events: events
        });
    };

    generateBet = async (event, choice, amount, createDeepLink = false) => {
        console.log('generateBet event', event);

        var betId = await this.createBet(event, event.selected, this.state.amount);

        var branchUniversalObject = await Expo.DangerZone.Branch.createBranchUniversalObject(
            betId,
            {
                title: 'Fantasy Down',
                contentImageUrl: 'http://placehold.it/50x50',
                contentDescription: 'this is the description',
                // This metadata can be used to easily navigate back to this screen
                // when implementing deep linking with `Branch.subscribe`.
                metadata: {
                    screen: 'articleScreen',
                    params: JSON.stringify({
                        betId: betId.toString(),
                    }),
                },
            }
        );

        const shareOptions = {
            messageHeader: 'Fantasy Down message header',
            messageBody: `Somebody wants to make a bet!`,
        };
        await branchUniversalObject.showShareSheet(shareOptions);





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
                <Text style={styles.headerText}>
                    {title["-hnn"].capitalize()} vs {title["-vnn"].capitalize()}
                </Text>
            </View>
        );
    }
    //@autobind
    profile() {
        this.props.navigation.navigate("Profile");
    }

    async upload(): Promise<void> {
        try {
            this.id = await ImageUpload.uid();
            this.user = Firebase.auth.currentUser;
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            Alert.alert(e);
        }
    }

    async createBet(event, choice, amount): Promise<void> {
        // import FieldValue from require('firebase-admin').firestore.FieldValue;
        // var admin = require("firebase-admin");

        try {
            const { uid } = Firebase.auth.currentUser;
            // TODO: need to firestore id
            var id = uuid.v1();
            const bet = {
                id: id,
                uid,
                comments: 0,
                likes: [],
                eventId: event['-eid'],
                event: event,
                amount: parseInt(this.state.amount),
                bettor: {
                    id: uid,
                    choice: choice,
                },
                timestamp: parseInt(moment().format('X'), 10),
                // timestamp: FieldValue.serverTimestamp()
            };

            var postRef = firebase
                .firestore()
                .collection('feed')
                .doc(id)
                .set(bet)
                // .add(bet)
                .then(function() {
                    console.log("Document successfully written!");
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                });

            return id;
        } catch (e) {
            console.log(e);
        }
    }

    renderContent(event) {
        console.log("renderContent event: ", event);

        let teamHomeColor = "#dddddd";
        let teamAwayColor = "#dddddd";
        let teamHomeText = "#000000";
        let teamAwayText = "#000000";
        if (event.selected === event["-h"]) {
            teamHomeColor = "lightgreen";
            teamHomeText = "#ffffff";
        }
        if (event.selected === event["-v"]) {
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
                            onPress={() => this.selectTeam(event, event["-h"])}
                            light
                            block
                        >
                            <Text style={{ color: teamHomeText }}>{event["-h"]}</Text>
                        </Button>
                    </View>
                    <View style={{ flex: 1, marginBottom: 30, marginLeft: 5 }}>
                        <Button
                            style={{ backgroundColor: teamAwayColor }}
                            onPress={() => this.selectTeam(event, event["-v"])}
                            light
                            block
                        >
                            <Text style={{ color: teamAwayText }}>{event["-v"]}</Text>
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
                            onPress={() => this.generateBet(event, event.selected, this.state.amount, true) }
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
                <Card title="Token Balance">
                    <View style={styles.logo} />
                    <Text style={styles.paragraph}>Earn tokens by referring friends</Text>
                </Card>
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
        padding: 10
    },
    header: {
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#eeeeee",
        padding: 20,
        alignSelf: "stretch"
    },
    headerText: {
        fontSize: 24
    },
    logo: {
        backgroundColor: "#106ecf",
        height: 128,
        width: 128,
        alignItems: "center",
        justifyContent: "center"
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
