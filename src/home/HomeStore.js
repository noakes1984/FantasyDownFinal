// @flow
import {observable, computed} from "mobx";

import {Firebase} from "../components";
import type {Feed, FeedEntry, Profile, Post} from "../components/Model";

export default class HomeStore {

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
        this.init();
    }

    async init(): Promise<void> {
        // Load Main Feed
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

        // Load Profile

        const {uid} = Firebase.auth.currentUser;
        Firebase.firestore.collection("users")
            .doc(uid)
            .onSnapshot(snap => this.profile = snap.data());

        // Load profile Feed
        Firebase.firestore.collection("feed").where("uid", "==", uid).orderBy("timestamp", "desc")
            .onSnapshot(async snap => {
                const posts: Post[] = [];
                snap.forEach(postDoc => {
                    posts.push(postDoc.data());
                });
                this.userFeed = posts;
            });
    }
}
