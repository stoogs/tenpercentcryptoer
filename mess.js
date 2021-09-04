let fs = require('fs')
let csv = fs.readFileSync('Bitstamp_BTCUSD_d-1.csv', 'utf8');
let csvArrayDaily = csv.split(/\r?\n/).slice(2,-1);
const currentBtcPrice = csvArrayDaily[0].split(',')[3];

const months = 43
const monthlyInvestment = 100
let totalInvestment = months * monthlyInvestment

let csvArrayMonthly = (csvArray) => {
    return csvArray.filter(function(daily) {
        return daily.split(',')[1].split('-')[2].split(' ')[0] == '01' });
}

let monthlyArray = csvArrayMonthly(csvArrayDaily)
let monthlyArrayOpenings =  monthlyArray.map( monthly =>  monthly.split(',')[3]);
let usersOpeningsMonths = monthlyArrayOpenings.slice(0, months)
let accruedBitcoin = usersOpeningsMonths.map( (price) => {
    return (monthlyInvestment / price);
})

let totalAccruedBitcoin = accruedBitcoin.reduce((a,b) => a+b)
let gross = (totalAccruedBitcoin * currentBtcPrice).toFixed(0)
let profit = gross - totalInvestment;

console.log(`If you invested for ${months} months, ${(months/12).toFixed(1)} years,  $${monthlyInvestment}`)
console.log(`Invested $`, totalInvestment)
console.log(`Profited $`, profit)
console.log('------------------')
console.log(`Accrued  $ ${gross} (${(profit/totalInvestment*100).toFixed(0)})%` )
console.log('------------------')
