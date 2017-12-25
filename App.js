// @flow
/* eslint-disable no-console */
import autobind from "autobind-decorator";
import * as React from "react";
import {StatusBar, Platform} from "react-native";
import {StyleProvider} from "native-base";
import {StackNavigator, TabNavigator} from "react-navigation";
import {Font, AppLoading} from "expo";
import {useStrict} from "mobx";
import {Provider} from "mobx-react/native";
import {Feather} from "@expo/vector-icons";

import {Images, Firebase, FeedStore} from "./src/components";
import {Welcome} from "./src/welcome";
import {Walkthrough} from "./src/walkthrough";
import {SignUpName, SignUpEmail, SignUpPassword, Login} from "./src/sign-up";
import {
    Profile, Explore, Share, SharePicture, HomeTab, Comments, Settings, ProfileStore
} from "./src/home";

import getTheme from "./native-base-theme/components";
import variables from "./native-base-theme/variables/commonColor";

interface AppState {
    staticAssetsLoaded: boolean,
    authStatusReported: boolean,
    isUserAuthenticated: boolean
}

useStrict(true);

const originalSend = XMLHttpRequest.prototype.send;
// https://github.com/firebase/firebase-js-sdk/issues/283
// $FlowFixMe
XMLHttpRequest.prototype.send = function(body: string) {
  if (body === "") {
    originalSend.call(this);
  } else {
    originalSend.call(this, body);
  }
};

// https://github.com/firebase/firebase-js-sdk/issues/97
// $FlowFixMe
console.ignoredYellowBox = [
    "Setting a timer"
];

export default class App extends React.Component<{}, AppState> {

    state: AppState = {
        staticAssetsLoaded: false,
        authStatusReported: false,
        isUserAuthenticated: false
    };

    componentWillMount() {
        StatusBar.setBarStyle("dark-content");
        if (Platform.OS === "android") {
            StatusBar.setBackgroundColor("white");
        }
        this.loadStaticResources();
        Firebase.init();
        Firebase.auth.onAuthStateChanged(user => {
            this.setState({
                authStatusReported: true,
                isUserAuthenticated: !!user
            });
        });
    }

    async loadStaticResources(): Promise<void> {
        try {
            const images = Images.downloadAsync();
            const fonts = Font.loadAsync({
                "SFProText-Medium": require("./fonts/SF-Pro-Text-Medium.otf"),
                "SFProText-Heavy": require("./fonts/SF-Pro-Text-Heavy.otf"),
                "SFProText-Bold": require("./fonts/SF-Pro-Text-Bold.otf"),
                "SFProText-Semibold": require("./fonts/SF-Pro-Text-Semibold.otf"),
                "SFProText-Regular": require("./fonts/SF-Pro-Text-Regular.otf"),
                "SFProText-Light": require("./fonts/SF-Pro-Text-Light.otf")
            });
            const icons = Font.loadAsync(Feather.font);
            await Promise.all([...images, fonts, icons]);
            this.setState({ staticAssetsLoaded: true });
        } catch(error) {
            console.error(error);
        }
    }

    render(): React.Node {
        const {onNavigationStateChange} = this;
        const {staticAssetsLoaded, authStatusReported, isUserAuthenticated} = this.state;
        let feedStore, profileStore, userFeedStore;
        if (isUserAuthenticated) {
            const {uid} = Firebase.auth.currentUser;
            const feedQuery = Firebase.firestore
                .collection("feed")
                .orderBy("timestamp", "desc");
            const userFeedQuery = Firebase.firestore
                .collection("feed")
                .where("uid", "==", uid)
                .orderBy("timestamp", "desc");
            profileStore = new ProfileStore();
            feedStore = new FeedStore(feedQuery);
            userFeedStore = new FeedStore(userFeedQuery);
        }
        return <StyleProvider style={getTheme(variables)}>
            {
                (staticAssetsLoaded && authStatusReported) ?
                    (
                        isUserAuthenticated
                            ?
                                (
                                    <Provider {...{feedStore, profileStore, userFeedStore}} >
                                        <Home {...{onNavigationStateChange}} />
                                    </Provider>
                                )
                            :
                                <AppNavigator {...{onNavigationStateChange}} />
                    )
                :
                    <AppLoading />
            }
        </StyleProvider>;
    }

    @autobind
    onNavigationStateChange() {
        return undefined;
    }
}

const StackNavigatorOptions = {
    headerMode: "none",
    cardStyle: {
        backgroundColor: "white"
    }
};

const ExploreNavigator = StackNavigator({
    Explore: { screen: Explore },
    Comments: { screen: Comments }
}, StackNavigatorOptions);

const ProfileNavigator =  StackNavigator({
    Profile: { screen: Profile },
    Settings: { screen: Settings },
    Comments: { screen: Comments }
}, StackNavigatorOptions);

const ShareNavigator = StackNavigator({
    Share: { screen: Share },
    SharePicture: { screen: SharePicture }
}, StackNavigatorOptions);

const HomeTabs = TabNavigator({
    Explore: { screen: ExploreNavigator },
    Share: { screen: ShareNavigator },
    Profile: { screen: ProfileNavigator }
}, {
    animationEnabled: false,
    tabBarComponent: HomeTab,
    tabBarPosition: "bottom"
});

const Home = StackNavigator({
    Walkthrough: { screen: Walkthrough },
    Home: { screen: HomeTabs }
}, StackNavigatorOptions);

const AppNavigator = StackNavigator({
    Welcome: { screen: Welcome },
    Login: { screen: Login },
    SignUp: { screen: SignUpName },
    SignUpEmail: { screen: SignUpEmail },
    SignUpPassword: { screen: SignUpPassword }
}, StackNavigatorOptions);

export {AppNavigator};
