// @flow
import {observable, computed} from "mobx";

import {Firebase} from "../components";
import type {Feed, FeedEntry, Profile} from "../components/Model";

export default class HomeStore {

    @observable _feed: Feed;
    @observable _profile: Profile;

    @computed get feed(): Feed { return this._feed; }
    set feed(feed: Feed) { this._feed = feed; }

    @computed get profile(): Profile { return this._profile; }
    set profile(profile: Profile) { this._profile = profile; }

    constructor() {
        this.init();
    }

    async init(): Promise<void> {
        Firebase.firestore.collection("feed").orderBy("timestamp", "desc").onSnapshot(async snap => {
            const posts: Promise<FeedEntry>[] = [];
            snap.forEach(postDoc => {
                posts.push((async () => {
                    const post = postDoc.data();
                    const profileDoc = await Firebase.firestore.collection("users").doc(post.uid).get();
                    const profile = profileDoc.data();
                    return { post, profile };
                })());
            });
            this.feed = await Promise.all(posts);
        });
        const {uid} = Firebase.auth.currentUser;
        Firebase.firestore.collection("users")
            .doc(uid)
            .onSnapshot(snap => this.profile = snap.data());
    }
}
