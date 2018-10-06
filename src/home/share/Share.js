// import React, { Component } from "react";
// import { Text, View } from "react-native";
//
// export default class Share extends Component {
//     render() {
//         return (
//             <View>
//                 <Text>thisshit</Text>
//             </View>
//         );
//     }
// }

//@flow
// @flow
// import autobind from "autobind-decorator";
import * as React from "react";
const firebase = require("firebase");
import {
    StyleSheet,
    View,
    ListView,
    Text,
    Dimensions,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Image,
    Modal
} from "react-native";

//import { createRouter, NavigationProvider, StackNavigation } from "@exponent/ex-navigation";
import { Camera, Permissions } from "expo";
import { Feather as Icon } from "@expo/vector-icons";
import Spinner from "react-native-loading-spinner-overlay";

import EnableCameraPermission from "./EnableCameraPermission";

import Chat from "./Chat";
import md5 from "../../lib/md5";
var navigator;

import { RefreshIndicator, Theme, NavHeader, SpinningIndicator, serializeException } from "../../components";
import type { ScreenProps } from "../../components/Types";

type ShareState = {
    hasCameraPermission: boolean | null,
    type: number,
    loading: boolean
};

const navigation = null;

export default class Share extends React.Component<ScreenProps<>, ShareState> {
    state = { loggedIn: null };

    /////

    componentDidMount() {
        console.log("Eat Shit and Die: " + firebase.auth().currentUser.email);
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({ loggedIn: true });
            } else {
                this.setState({ loggedIn: false });
            }
        });
        this.listenForItems(this.friendsRef);
    }

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            loading: true
        };

        this.friendsRef = this.getRef().child("friends");

        navigator = this.props.navigator;
        console.log("Navigator: " + navigator);
        console.log("Navigation: " + navigation);
    }

    getRef() {
        return firebase.database().ref();
    }

    listenForItems(friendsRef) {
        var user = firebase.auth().currentUser;
        //console.log((user: ""));

        friendsRef.on("value", snap => {
            // get children as an array
            var items = [];
            snap.forEach(child => {
                if (child.val().email != user.email)
                    items.push({
                        name: child.val().name,
                        uid: child.val().uid,
                        email: child.val().email
                    });
            });

            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(items),
                loading: false
            });
        });
    }
    //    const { navigate } = this.props.navigation;
    //  this.props.navigator.push
    renderRow = rowData => {
        const navigation = this.props.navigation;

        return (
            <TouchableOpacity onPress={() => this.props.navigation.push("chat")}>
                <View style={styles.profileContainer}>
                    <Image
                        source={{
                            uri: "https://www.gravatar.com/avatar/" + md5(rowData.email)
                        }}
                        style={styles.profileImage}
                    />
                    <Text style={styles.profileName}>{rowData.name}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <NavHeader title="Chat" {...{ navigation }} />
                <View style={styles.topGroup}>
                    <Text style={styles.myFriends}>My Friends</Text>
                    <TouchableOpacity>
                        <Text style={styles.inviteFriends}>Invite More Friends</Text>
                    </TouchableOpacity>
                </View>
                <ListView dataSource={this.state.dataSource} renderRow={this.renderRow} />
                <Spinner visible={this.state.loading} />
            </View>
        );
    }
}

/*
<TouchableOpacity style={{ backgroundColor: "blue", flex: 0.3 }} />
/////
export default class Share extends React.Component<ScreenProps<>, ShareState> {
    camera: Camera;

    state = null;

    async componentDidMount(): Promise<void> {}

    render(): React.Node {
        const { navigation } = this.props;

        return <FriendsList />;
    }
}
*/
const { width, height } = Dimensions.get("window");
const ratio = width / height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "stretch",
        marginRight: 10,
        marginLeft: 10
    },
    rightButton: {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 10,
        padding: 0
    },
    topGroup: {
        flexDirection: "row",
        margin: 10
    },
    myFriends: {
        flex: 1,
        // color: "darkGray",
        fontSize: 16,
        padding: 5
    },
    inviteFriends: {
        // color: "lightGray",
        padding: 5
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        marginLeft: 6,
        marginBottom: 8
    },
    profileImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginLeft: 6
    },
    profileName: {
        marginLeft: 6,
        fontSize: 16
    }
});
