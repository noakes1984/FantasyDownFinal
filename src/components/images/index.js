// @flow
import {Asset} from "expo";

export default class Images {

    static homes = require("./homes.jpg");
    static experiences = require("./experiences.jpg");
    static restaurants = require("./restaurants.jpg");

    static CapeTown = require("./cities/cape-town.jpg");
    static London = require("./cities/london.jpg");
    static LosAngeles = require("./cities/los-angeles.jpg");
    static Miami = require("./cities/miami.jpg");
    static Nairobi = require("./cities/nairobi.jpg");
    static Paris = require("./cities/paris.jpg");
    static SanFrancisco = require("./cities/san-francisco.jpg");
    static Tokyo = require("./cities/tokyo.jpg");

    static loading = require("./loading.jpg");

    static downloadAsync(): Promise<*>[] {
        return [
            Asset.loadAsync(Images.homes),
            Asset.loadAsync(Images.experiences),
            Asset.loadAsync(Images.restaurants),

            Asset.loadAsync(Images.CapeTown),
            Asset.loadAsync(Images.London),
            Asset.loadAsync(Images.LosAngeles),
            Asset.loadAsync(Images.Miami),
            Asset.loadAsync(Images.Nairobi),
            Asset.loadAsync(Images.Paris),
            Asset.loadAsync(Images.SanFrancisco),
            Asset.loadAsync(Images.Tokyo),

            Asset.loadAsync(Images.loading)
        ];
    }
}
