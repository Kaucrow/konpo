import Slice from '/Slice/Slice.js';

export const languages = await slice.build("IndexedDbManager", {
   databaseName: "languages",
   storeName: "languages",
   sliceId: "db-languages"
});

export const preferences = await slice.build("IndexedDbManager", {
   databaseName: "preferences",
   storeName: "preferences",
   sliceId: "db-preferences"
});

export const sessions = await slice.build("IndexedDbManager", {
   databaseName: "sessions",
   storeName: "sessions",
   sliceId: "db-sessions"
});

await languages.openDatabase();
await preferences.openDatabase();
await sessions.openDatabase();

//Languages

export function adduLanguage (_name, _pref) {
    languages.addItem({name:_name,id:_pref, deck: {}})
}

export function getLanguages(){
    let _languages = languages.getAllItems()
    let result = _languages.map(({name, id}) => ({name, id}));
    return result;
}

//Decks

export function adduDeck (pref, name, difficulty) {
    let language = languages.getItem(pref);
    language.deck[name] = {
        difficulty: difficulty,
        creationDate : new Date().toLocaleDateString(),
        lastPractice: null,
        practiceAttempts:0,
        words: {} 
    }
    languages.updateItem(language);
}

export function getDecks (pref){
    let decks = languages.getItem(pref);
    return decks.deck;
}

// Update when you practice a deck
export function practiceUpdate (pref, _deck) {
    let language = languages.getItem(pref);
    language.deck[_deck].lastPractice = new Date().toLocaleDateString();
    language.deck[_deck].practiceAttemps = language.deck[_deck].practiceAttemps+1;
    languages.updateItem(language);
}

//Words / phrases

export function adduWord (pref, deck, word, _translation, difficulty, _example, _notes) {
    let language = languages.getItem(pref);
    language.deck[deck].words[word] = {
        translation : _translation,
        difficulty: difficulty,
        example: _example,
        notes: _notes
    }
    languages.updateItem(language);
}

export function getWords (pref, _deck){
    let language = languages.getItem(pref);
    return language.deck[_deck].words;
}

//get words by difficulty
export function getHardWords(pref) {
    let language = languages.getItem(pref);
    let words = [];
    Object.values(language.deck).forEach(deck => {
        Object.values(deck.words || {}).forEach(word => {
            if (word.difficulty === 5) {
                hardWords.push(word);
            }
        });
    });
    return words;
}


/*
Model
language: {
    name: "English",
    id: "en",
    deck: {
        "test":{
            difficulty : "get a gf",
            creation-date: the-date()
            last-practice: today()
            practice-attempts: actual + 1;
            words: {
                "Your mom":{
                    translation: "Tu mama",
                    example: "I like your mom",
                    notes: "Wooooo",
                    difficulty: "talk to a goth mommy"
                }
            }
        }
    }
}

preferences: {
    theme: "dark"
}

sessions: {
    date: today,
    cards-practiced: 13
}
*/