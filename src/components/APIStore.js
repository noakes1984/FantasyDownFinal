// @flow
import * as _ from "lodash";
import type {ApiResponse, Home, Booking, Thread, Profile} from "./Model";

type ByCities<T> = { [string]: T[] };
type Callback = Home[] => void;

// eslint-disable-next-line max-len
const endpoint = "https://firebasestorage.googleapis.com/v0/b/react-native-ting.appspot.com/o/index.json?alt=media&token=073153af-88e1-40d9-8f40-cd045287161a";

export default class APIStore {

    static listeners: Callback[] = [];
    static saved: string[] = [];
    static data: ApiResponse;

    static async load(): Promise<void> {
        const result = await fetch(endpoint);
        APIStore.data = await result.json();
    }

    static homesByCities(): ByCities<Home> {
        return _.groupBy(APIStore.data.homes, home => home.location.city);
    }

    static home(id: string): Home {
        return APIStore.data.homes.filter(home => home.id === id)[0];
    }

    static bookingsByCities(): ByCities<Booking> {
        return _.groupBy(APIStore.data.bookings, booking => {
            const home = APIStore.home(booking.home);
            return home.location.city;
        });
    }

    static threads(): Thread[] {
        return APIStore.data.inbox.threads;
    }

    static profile(): Profile {
        return APIStore.data.profile;
    }

    static toggleSaved(id: string) {
        const index = APIStore.saved.indexOf(id);
        if (index === -1) {
            APIStore.saved.push(id);
        } else {
            APIStore.saved.splice(index, 1);
        }
        _.forEach(APIStore.listeners, listener => {
            const homes = APIStore.data.homes.filter(home => APIStore.saved.indexOf(home.id) !== -1);
            listener(homes);
        });
    }

    static savedHomes(callback: Callback) {
        APIStore.listeners.push(callback);
        const homes = APIStore.data.homes.filter(home => APIStore.saved.indexOf(home.id) !== -1);
        callback(homes);
    }

    static dispose(callback: Callback) {
        APIStore.listeners.forEach((listener, index) => {
            if (listener === callback) {
                APIStore.listeners.splice(index, 1);
            }
        });
    }
 }
