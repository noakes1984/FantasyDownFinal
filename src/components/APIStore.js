// @flow
const data = require("./data");

export type Picture = {
    uri: string,
    preview: string
};

export type Profile = {
    picture: Picture,
    cover: Picture,
    name: string,
    outline: string
};

export type Post = {
    uid: string,
    id: string,
    timestamp: number,
    name: string,
    profilePicture: Picture,
    text: string,
    picture?: Picture,
    video?: string
};

export type Comment = {
    id: string,
    text: string,
    name: string,
    picture: Picture
};

export default class APIStore {

    static profile(): Profile {
        return data.profile;
    }

    static comments(post: string): Comment[] {
        if (!data.comments[post]) {
            data.comments[post] = [];
        }
        return data.comments[post];
    }

    static addComment(post: string, comment: Comment) {
        if (!data.comments[post]) {
            data.comments[post] = [];
        }
        data.comments[post].push(comment);
    }
}
