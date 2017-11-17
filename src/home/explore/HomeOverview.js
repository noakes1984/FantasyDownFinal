// @flow
import autobind from "autobind-decorator";
import * as React from "react";
import {View, StyleSheet, Image, Dimensions, ScrollView} from "react-native";
import {Constants, MapView} from "expo";
import Swiper from "react-native-swiper"

import {Text, Theme, APIStore, IconButton, Avatar, LoadingIndicator, Ratings} from "../../components";
import type {ScreenParams} from "../../components/Types";

type HomeOverviewState = {
    transparentHeader: boolean,
    loading: boolean
};

export default class HomeOverview extends React.Component<ScreenParams<{ id: string }>, HomeOverviewState> {

    async componentWillMount(): Promise<void> {
        const {navigation} = this.props;
        const {id} = navigation.state.params;
        const home = APIStore.home(id);
        this.setState({ transparentHeader: true, loading: true });
        await Promise.all(
            home.pictures.map(picture =>
                Image.prefetch(picture)
            )
        );
        this.setState({ loading: false });
    }

    @autobind
    back() {
        this.props.navigation.goBack();
    }

    @autobind
    onScroll(event: { nativeEvent: { contentOffset: { x: number, y: number } }}) {
        const {y} = event.nativeEvent.contentOffset;
        const transparentHeader = y + 57 < height;
        if (transparentHeader !== this.state.transparentHeader) {
            this.setState({ transparentHeader });
        }
    }

    render(): React.Node {
        const {navigation} = this.props;
        const {id} = navigation.state.params;
        const home = APIStore.home(id);
        const {transparentHeader, loading} = this.state;
        return (
            <View style={styles.flex}>
                <View style={[styles.header, { backgroundColor: transparentHeader ? "transparent" : "white"}]}>
                    <IconButton name="ios-arrow-back-outline" onPress={this.back} contrast={transparentHeader} />
                </View>
                <ScrollView style={styles.flex} onScroll={this.onScroll} scrollEventThrottle={100}>
                    {
                        loading && <LoadingIndicator style={styles.loading} />
                    }
                    {
                        !loading && (
                            <Swiper showsPagination={false} {...{ height }}>
                            {
                                home.pictures.map(picture => (
                                    <Image
                                        key={picture}
                                        source={{ uri: picture }}
                                        style={styles.image}
                                        />
                                ))
                            }
                            </Swiper>
                        )
                    }
                    <View style={styles.container}>
                        <Text type="header2" gutterBottom={true}>{home.title}</Text>
                        <View style={styles.host}>
                            <View>
                                <Text type="large" gutterBottom={true}>{home.category1}</Text>
                                <Text gutterBottom={true}>{`Hosted by ${home.host.name}`}</Text>
                            </View>
                            <Avatar uri={home.host.picture} />
                        </View>
                        <Text>
                        {`${home.price.amount} ${home.price.currency} per night`}
                        </Text>
                        <Ratings value={home.rating.value} votes={home.rating.votes} />
                        <Text gutterBottom={true}>{home.description}</Text>
                    </View>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: home.location.lat,
                            longitude: home.location.lon,
                            latitudeDelta: 0.0022,
                            longitudeDelta: 0.0022,
                        }}
                    >
                        <MapView.Marker
                            coordinate={{ latitude: home.location.lat, longitude: home.location.lon }}
                            title={home.location.address}
                        />
                    </MapView>
                </ScrollView>
            </View>
        );
    }
}

const {width} = Dimensions.get("window");
const height = width * 0.67 + Constants.statusBarHeight;
const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    header: {
        position: "absolute",
        top: 0,
        height: 57 + Constants.statusBarHeight,
        zIndex: 1000,
        paddingTop: Constants.statusBarHeight,
        paddingLeft: Theme.spacing.base,
        justifyContent: "center",
        width
    },
    image: {
        width,
        height
    },
    container: {
        padding: Theme.spacing.base
    },
    host: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    map: {
        height: width * 0.62,
        width: width
    },
    loading: {
        height
    }
})
