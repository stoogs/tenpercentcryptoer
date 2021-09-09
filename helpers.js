import fs from 'fs'
import fetch from 'node-fetch';
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
let currentDate = getCurrentDate()
let dataIsCurrent = checkIfLatestData();

export function getCurrentDate() {
    let date = new Date().toISOString().substr(0, 19).replace('T', ' ');
    return date.split(' ')[0]
}

export async function checkIfLatestData(currentDate) {
    let data = fs.readFileSync('Bitstamp_BTCUSD.csv', 'utf8');
    let csvArrayDaily = data.split(/\r?\n/).slice(2,3);
    const dateFromFile = csvArrayDaily[0].split(',')[1].split(' ')[0];
    return (dateFromFile === currentDate)
}

export async function getLatestData(dataIsCurrent, currentDate) {
    if (!dataIsCurrent) {
        console.log('Grabbing latest data for today', currentDate)
        const response = await fetch(' https://www.cryptodatadownload.com/cdd/Bitstamp_BTCUSD_d.csv')
        let latestData = await response.text();
        fs.writeFile('./BITSTAMP_BTCUSD.csv', latestData, function (err) {
            if (err) return console.log(err);
            console.log('Latest file retrieved for today', currentDate);
        });
        return fs.readFileSync('Bitstamp_BTCUSD.csv', 'utf8');
    }
    return fs.readFileSync('Bitstamp_BTCUSD.csv', 'utf8');
}
