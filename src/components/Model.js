// @flow
export type Picture = {
    uri: string,
    preview: string
};

export type Profile = {
    picture: Picture,
    name: string,
    outline: string
};

export type Post = {
    uid: string,
    id: string,
    likes: string[],
    comments: number,
    timestamp: number,
    text: string,
    picture: Picture
};

export type Comment = {
    id: string,
    text: string,
    uid: string,
    timestamp: number
};
