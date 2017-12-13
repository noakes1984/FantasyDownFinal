// @flow
import * as _ from "lodash";
import {observable, computed} from "mobx";

import {Firebase} from "../components";
import type {Feed, FeedEntry, Profile, Post} from "../components/Model";

const DEFAULT_PROFILE: Profile = {
    name: "John Doe",
    outline: "React Native",
    picture: {
        // eslint-disable-next-line max-len
        "uri": "https://firebasestorage.googleapis.com/v0/b/react-native-ting.appspot.com/o/fiber%2Fprofile%2FJ0k2SZiI9V9KoYZK7Enru5e8CbqFxdzjkHCmzd2yZ1dyR22Vcjc0PXDPslhgH1JSEOKMMOnDcubGv8s4ZxA.jpg?alt=media&token=6d5a2309-cf94-4b8e-a405-65f8c5c6c87c",
        "preview": "data:image/gif;base64,R0lGODlhAQABAPAAAKyhmP///yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
    }
};
const DEFAULT_PAGE_SIZE = 10;

export default class HomeStore {

    cursor;

    @observable _feed: Feed;
    @observable _profile: Profile;
    @observable _userFeed: Post[];

    @computed get feed(): Feed { return this._feed; }
    set feed(feed: Feed) { this._feed = feed; }

    @computed get profile(): Profile { return this._profile; }
    set profile(profile: Profile) { this._profile = profile; }

    @computed get userFeed(): Post[] { return this._userFeed; }
    set userFeed(feed: Post[]) { this._userFeed = feed; }

    constructor() {
        this.loadFeed();
        this.initProfile();
        this.initUserFeed();
    }

    async initProfile(): Promise<void> {
        // Load Profile
        const {uid} = Firebase.auth.currentUser;
        Firebase.firestore.collection("users").doc(uid).onSnapshot(async snap => {
            if (snap.exists) {
                this.profile = snap.data();
            } else {
                await Firebase.firestore.collection("users").doc(uid).set(DEFAULT_PROFILE);
                this.profile = DEFAULT_PROFILE;
            }
        });
    }

    loadFeed() {
        let query = Firebase.firestore.collection("feed").orderBy("timestamp", "desc");
        if (this.cursor) {
            query = query.startAfter(this.cursor);
        }
        query.limit(DEFAULT_PAGE_SIZE).onSnapshot(async snap => {
            if (snap.docs.length === 0) {
                return;
            }
            const posts: Promise<FeedEntry>[] = [];
            snap.forEach(postDoc => {
                posts.push((async () => {
                    const post = postDoc.data();
                    let profile: Profile;
                    try {
                        const profileDoc = await Firebase.firestore.collection("users").doc(post.uid).get();
                        profile = profileDoc.data();
                    } catch (e) {
                        profile = DEFAULT_PROFILE;
                    }
                    return { post, profile };
                })());
            });
            const feed = await Promise.all(posts);
            if (this.feed) {
                const newFeed = _.orderBy(
                    _.uniqBy(this.feed.concat(feed), entry => entry.post.id),
                    entry => entry.post.timestamp,
                    ["desc"]
                );
                if (newFeed.length !== this.feed.length) {
                    this.feed = newFeed;
                }
            } else {
                this.feed = feed;
            }
            this.cursor = _.last(snap.docs);
        });
    }

    initUserFeed() {
        const {uid} = Firebase.auth.currentUser;
        Firebase.firestore
        .collection("feed").where("uid", "==", uid).orderBy("timestamp", "desc")
            .onSnapshot(async snap => {
                const posts: Post[] = [];
                snap.forEach(postDoc => {
                    posts.push(postDoc.data());
                });
                this.userFeed = posts;
            });
    }
}
