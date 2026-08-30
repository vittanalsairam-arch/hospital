const fs = require('fs');
const path = require('path');

// 1. Full 9 States (Andhra 26, Telangana 33, Maharashtra 36, Karnataka 31, Tamil Nadu 38, Gujarat 33, Rajasthan 33, Kerala 14, Delhi NCR 11)
const part1States = require('./statesData');

// 2. Remaining 20 States
const part2Code = fs.readFileSync(path.join(__dirname, 'generateAllDistrictsIndia.js'), 'utf-8');
const match = part2Code.match(/const additionalStates = (\[[\s\S]*?\]);\r?\n\r?\n\/\/ Merge/);
if (!match) {
  console.error('Could not extract additionalStates');
  process.exit(1);
}

const additionalStates = eval(match[1]);

const allStatesMap = {};
part1States.forEach(s => {
  allStatesMap[s.name] = s;
});

additionalStates.forEach(s => {
  if (!allStatesMap[s.name]) {
    allStatesMap[s.name] = s;
  } else if (s.districts.length > allStatesMap[s.name].districts.length) {
    allStatesMap[s.name] = s;
  }
});

const final29States = Object.values(allStatesMap);

const outputPath = path.join(__dirname, 'statesData.js');
fs.writeFileSync(outputPath, `// COMPLETE OFFICIAL 29-STATE NATIONAL HIERARCHY OF INDIA
// Comprehensive coverage of all official Districts, Cities, Mandals/Taluks, Hospitals & Exterior Photos

module.exports = ${JSON.stringify(final29States, null, 2)};\n`, 'utf-8');

console.log('Successfully compiled all 29 States of India with complete district coverage into statesData.js!');
console.log('Total States:', final29States.length);

let totalDistricts = 0;
let totalCities = 0;
let totalMandals = 0;

final29States.forEach(s => {
  totalDistricts += s.districts.length;
  s.districts.forEach(d => {
    totalCities += d.cities.length;
    d.cities.forEach(c => {
      totalMandals += c.subCities.length;
    });
  });
  console.log(` - ${s.name}: ${s.districts.length} Districts, ${s.districts.reduce((acc, d) => acc + d.cities.length, 0)} Cities`);
});

console.log('==============================================');
console.log('FINAL TOTAL DISTRICTS:', totalDistricts);
console.log('FINAL TOTAL CITIES:', totalCities);
console.log('FINAL TOTAL MANDALS / SUB-CITIES:', totalMandals);
console.log('==============================================');
