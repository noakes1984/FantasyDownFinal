// @flow

export type Post = {
    id: string,
    timestamp: number,
    name: string,
    profilePicture: string,
    text: string,
    picture?: string,
    video?: string
};

export default class APIStore {
    static posts(): Post[] {
        return [
            {
                id: "24d55bd4-b66e-407f-87ba-c03d51755f0f",
                timestamp: 1510127619,
                name: "Jackie Parker",
                // eslint-disable-next-line max-len
                profilePicture: "https://firebasestorage.googleapis.com/v0/b/react-native-ting.appspot.com/o/fiber%2Favatars%2Fjackie.jpg?alt=media&token=c4ad2626-02a7-402d-bf0c-29310b611a24",
                text: "What I love most about this crazy life is the adventure of it.",
                // eslint-disable-next-line max-len
                picture: "https://firebasestorage.googleapis.com/v0/b/react-native-ting.appspot.com/o/fiber%2Fposts%2Fkristopher-roller-207130.jpg?alt=media&token=21e29fe9-f28e-426a-b0c5-7c1bb5a69054"
            },
            {
                id: "88541578-5966-41d4-9e69-091c993611dc",
                timestamp: 1510121619,
                name: "Maggie Cross",
                // eslint-disable-next-line max-len
                profilePicture: "https://firebasestorage.googleapis.com/v0/b/react-native-ting.appspot.com/o/fiber%2Favatars%2Fmaggie.png?alt=media&token=21fe02b4-445a-47d3-9f1a-520cb337abac",
                text: "I think risk-taking is a great adventure. And life should be full of adventures."
            }
        ];
    }
}
