import { getCurrentDate, checkIfLatestData, getLatestData, determineFile } from './helpers.js';
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

let currentDate = getCurrentDate();
let fileIsGood = await determineFile()
let latestFilePulled = await checkIfLatestData(currentDate, fileIsGood);

let latestData = await getLatestData(currentDate, fileIsGood).then(data => {
        return data;
});

let csvArrayDaily = latestData.split(/\r?\n/).slice(2,-1);
const currentBtcPrice = csvArrayDaily[0].split(',')[3];

const months = 12
const monthlyInvestment = 200
let totalInvestment = months * monthlyInvestment

let csvArrayMonthly = (csvArray) => {
    return csvArray.filter(function(daily) {
        return daily.split(',')[1].split('-')[2].split(' ')[0] == '01' });
}

let monthlyArray = csvArrayMonthly(csvArrayDaily)
let monthlyArrayOpenings =  monthlyArray.map( monthly =>  monthly.split(',')[3]);
let usersOpeningsMonths = monthlyArrayOpenings.slice(0, months)

let accruedBitcoin = usersOpeningsMonths.map( (price) => {
    const dollarPerBitcoin = 1 / price;
    return (dollarPerBitcoin * monthlyInvestment);
})

let totalAccruedBitcoin = accruedBitcoin.reduce((a,b) => a+b)
let gross = (totalAccruedBitcoin * currentBtcPrice).toFixed(0)
let profit = gross - totalInvestment;

console.log(`If you invested $${monthlyInvestment} for ${months} months`)
console.log(`Invested $`, totalInvestment)
console.log(`Profit   $`, profit)
console.log('---------------------------------------')
console.log(`Total    $ ${gross} (${ (profit/totalInvestment*100).toFixed(0)}%) and ${totalAccruedBitcoin.toFixed(4)} BTC` )
console.log('---------------------------------------')
