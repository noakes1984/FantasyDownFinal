const colors = [{
    abbrev: 'ARI',
    color: '#97233F',
}, {
    abbrev: 'ATL',
    color: '#A71930',
}, {
    abbrev: 'BAL',
    color: '#241773',
}, {
    abbrev: 'BUF',
    color: '#00338D',
}, {
    abbrev: 'CAR',
    color: '#0085CA',
}, {
    abbrev: 'CHI',
    color: '#0B162A',
}, {
    abbrev: 'CIN',
    color: '#FB4F14',
}, {
    abbrev: 'CLE',
    color: '#FF3C00',
}, {
    abbrev: 'DAL',
    color: '#041E42',
}, {
    abbrev: 'DEN',
    color: '#FB4F14',
}, {
    abbrev: 'DET',
    color: '#0076B6',
}, {
    abbrev: 'GB',
    color: '#203731',
}, {
    abbrev: 'HOU',
    color: '#03202F',
}, {
    abbrev: 'IND',
    color: '#002C5F',
}, {
    abbrev: 'JAX',
    color: '#006778',
}, {
    abbrev: 'KC',
    color: '#E31837',
}, {
    abbrev: 'LAC',
    color: '#0080C6',
}, {
    abbrev: 'LA',
    color: '#002244',
}, {
    abbrev: 'MIA',
    color: '#008E97',
}, {
    abbrev: 'MIN',
    color: '#4F2683',
}, {
    abbrev: 'NE',
    color: '#002244',
}, {
    abbrev: 'NO',
    color: '#D3BC8D',
}, {
    abbrev: 'NYG',
    color: '#0B2265',
}, {
    abbrev: 'NYJ',
    color: '#003F2D',
}, {
    abbrev: 'OAK',
    color: '#000000',
}, {
    abbrev: 'PHI',
    color: '#004C54',
}, {
    abbrev: 'PIT',
    color: '#FFB612',
}, {
    abbrev: 'SF',
    color: '#AA0000',
}, {
    abbrev: 'SEA',
    color: '#002244',
}, {
    abbrev: 'TB',
    color: '#D50A0A',
}, {
    abbrev: 'TEN',
    color: '#002A5C',
}, {
    abbrev: 'WAS',
    color: '#773141',
}];

export default function(abbrev) {
    const team = colors.find(function(team) {
        return team.abbrev === abbrev;
    });

    return team || {
        color: '#FFFFFF'
    };
}
