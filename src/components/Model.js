// @flow
export type Home = {
    id: string,
    location: {
        address: string,
        city: string,
        country: string,
        lon: number,
        lat: number
    },
    category1: string,
    category2: string,
    title: string,
    price: {
        amount: number,
        currency: string
    },
    rating: {
        value: number,
        votes: number
    },
    pictures: string[],
    host: {
        name: string,
        picture: string
    },
    description: string,
    amenities: string[]
};

export type Booking = {
    id: string,
    home: string,
    from: number,
    to: number
};

export type Review = {
    review: string,
    name: string,
    picture: string,
    date: number
};

export type Profile = {
    name: string,
    picture: string,
    memberSince: number
};

export type Message = {
    me: boolean,
    date: number,
    message: string
};

export type Thread = {
    date: number,
    name: string,
    picture: string,
    messages: Message[]
};

export type Inbox = {
    unreadMessages: number,
    threads: Thread[]
};

export type ApiResponse = {
    homes: Home[],
    bookings: Booking[],
    profile: Profile,
    inbox: Inbox
};
