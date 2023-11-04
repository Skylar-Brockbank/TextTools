import fs from 'fs';

const filePath='./testData/test.txt';
const dictionaryFilePath='./testData/dictionary.json'
let rawText = fs.readFileSync(filePath,{encoding:'utf8'});
let weightedSyllableDictionary = JSON.parse(fs.readFileSync(dictionaryFilePath));

var punctuation = /[\.,?!]/g;

let thinData = (inputString) =>{
    let wordBank = inputString.replace(punctuation,'');
    wordBank = wordBank.split('\n').join(' ');
    wordBank = wordBank.toLowerCase();
    let wordArray=wordBank.split(' ');
    let uniqueWords=[];
    wordArray.forEach(word => {
        if(!uniqueWords.includes(word)){
            uniqueWords.push(word);
        }
    });
    return uniqueWords;
}

let trainModel = (data)=>{
    data.forEach(word=>{
        let syllables=breakSyllables(word);
        if(syllables.length==1){
            if(!weightedSyllableDictionary.start.includes(syllables[0])){
                weightedSyllableDictionary.start.push(syllables[0]);
            }
        }
        if(syllables.length<=2){
            if(!weightedSyllableDictionary.start.includes(syllables[0])){
                weightedSyllableDictionary.start.push(syllables[0]);
            }
            if(!weightedSyllableDictionary.end.includes(syllables[syllables.length-1])){
                weightedSyllableDictionary.end.push(syllables[syllables.length-1]);
            }
        }
        if(syllables.length<=3){
            for(let i=1; i<syllables.length-1; i++){
                if(!weightedSyllableDictionary.middle.includes(syllables[i])){
                    weightedSyllableDictionary.middle.push(syllables[i]);
                }
            }
        }
    });
    
}

// let trainModel = (data)=>{
//     data.forEach(word=>{
//         let syllables=breakSyllables(word);
//         for(let i=0;i<=syllables.length; i++){
//             if (i+1<syllables.length){
//                 if(!weightedSyllableDictionary[syllables[i]]){
//                     weightedSyllableDictionary[syllables[i]]={};
//                     // weightedSyllableDictionary[syllables[i]].count=1;
//                     weightedSyllableDictionary[syllables[i]][syllables[i+1]]=50;
//                 }else if(weightedSyllableDictionary[syllables[i]][syllables[i+1]]){
//                     // weightedSyllableDictionary[syllables[i]].count+=1;
//                     weightedSyllableDictionary[syllables[i]][syllables[i+1]]+=50;
//                 }else{
//                     // weightedSyllableDictionary[syllables[i]].count+=1;
//                     weightedSyllableDictionary[syllables[i]][syllables[i+1]]=50;
//                 }
//             }
//         }
//     });

//     let keyArray = Object.keys(weightedSyllableDictionary);

//     keyArray.map(key=>{
//         let target = weightedSyllableDictionary[key]
//         keyArray.map(subKey=>{
//             if(!target[subKey]&& subKey!=key){
//                 target[subKey]=1;
//             }
//         })
//     })

    
// }

let consonants=[
    "b",
    "c",
    "d",
    "f",
    "g",
    "h",
    "j",
    "k",
    "l",
    "m",
    "n",
    "p",
    "q",
    "r",
    "s",
    "t",
    "v",
    "w",
    "x",
    "y",
    "z"
];
let vowels=[
    "a",
    "e",
    "i",
    "o",
    "u",
    "y"
];

let choose=(list)=>{
    return list[Math.floor(Math.random()*list.length)];
};

let containsVowels = (word)=>{
    let output=false;
    vowels.map(v=>{
        if(word.toLowerCase().includes(v)){
            output =  true;
        }
    });
    return output;
}

let breakSyllables=(input)=>{
    let syllables=[];
    let temp="";
    let word = input;
    let silentE=false;
    if(word[word.length-1]=='e'){
        word=word.substring(0,word.length-1);
        silentE=true;
    }

    for(let i=word.length-1;i>=0;i--){
        temp=word[i]+temp;
        if(!vowels.includes(temp[0])&& vowels.includes(temp[1])){
            syllables.unshift(temp.toLowerCase());
            temp="";
        }
        if(i==0&&temp!=""){
            if(containsVowels(temp)){
                syllables.unshift(temp.toLowerCase());
                temp="";

            }else{
                if(syllables[0]){
                    syllables[0]=temp+syllables[0];
                    temp="";
                }else{
                    syllables[0]=temp;
                }
            }
        }
    }
    if(silentE){
        syllables[syllables.length-1]=syllables[syllables.length-1]+'e';
    }
    return syllables;
}
let makeWord = (numberOfSyllables)=>{
    let prefix = choose(weightedSyllableDictionary.start);
    let output = prefix;
    if(numberOfSyllables>=3){
        let middle = [];
        for(let i = numberOfSyllables-2;i>0;i--){
            middle.push(choose(weightedSyllableDictionary.middle));
        }
        output = output+middle.join('');
    }
    if(numberOfSyllables>=2){
        let suffix = choose(weightedSyllableDictionary.end);
        output = output+suffix;
    }
    
    return output;
}
let nameBlock=(it)=>{
    let output=[];
    for(let o=it; o>0;o--){
        output.push(makeWord(process.env.NAME_SECTIONS));
    }
    return output;
}

trainModel(thinData(rawText));



console.log(nameBlock(process.env.NAME_QTY));
// console.log(containsVowels('test'));