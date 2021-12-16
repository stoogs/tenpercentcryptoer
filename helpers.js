import fs from 'fs'
import fetch from 'node-fetch';
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
let currentDate = getCurrentDate()
// let dataIsCurrent = checkIfLatestData();

export function getCurrentDate() {
    let date = new Date().toISOString().substr(0, 19).replace('T', ' ');
    return date.split(' ')[0]
}

export async function determineFile() {
    let fileExists = fs.existsSync('./Bitstamp_BTCUSD_d.csv')
    if (fileExists) {
        console.log('File Exists', fileExists)
        fs.stat('./Bitstamp_BTCUSD_d.csv', function (err, stats) {
            console.log('filestatssss',stats.size)
                if (stats && stats.size === 0) {
                    fs.unlink('./Bitstamp_BTCUSD_d.csv', function (err) {
                        if (err) return console.log(err);
                        console.log('file had to be deleted');
                    });
                    return false;
                }
            return true;
        });
    }
    return false;
}

export async function checkIfLatestData(currentDate,fileIsGood) {
    if(fileIsGood) {
        let data = fs.readFileSync('./Bitstamp_BTCUSD_d.csv', 'utf8');
        console.log(data.length)
        if (data && data.length > 0) {
            let csvArrayDaily = data.split(/\r?\n/).slice(2, 3);
            const dateFromFile = csvArrayDaily[0].split(',')[1].split(' ')[0];
            return (dateFromFile === currentDate)
        } else {
            return false;
            console.log('Error with data')
        }
    }

}

export async function getLatestData(currentDate, fileIsGood) {
    if (!fileIsGood) {
        console.log('Grabbing latest data for today', currentDate)
        const response = await fetch('https://www.cryptodatadownload.com/cdd/Bitstamp_BTCUSD_d.csv')
        let latestData = await response.text();
         fs.writeFileSync('./Bitstamp_BTCUSD_d.csv', latestData, function (err) {
            if (err) return console.log('Error...', err);
            console.log('****Latest file NOT retrieved***', currentDate);
        });
        return fs.readFileSync('./Bitstamp_BTCUSD_d.csv', 'utf8');
    }
    return fs.readFileSync('./Bitstamp_BTCUSD_d.csv', 'utf8');
}
