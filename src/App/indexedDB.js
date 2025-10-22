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

export function adduLanguage (name) {
    languages.addItem({id:name, deck: {}})
}

export async function getLanguages(){
    let _languages = await languages.getAllItems()
    let result = _languages.map(({id}) => ({id}));
    return result;
}

//Decks

export async function adduDeck (lang, name, difficulty) {
    let language = await languages.getItem(lang);
    language.deck[name] = {
        difficulty: difficulty,
        creationDate : new Date().toLocaleDateString(),
        lastPractice: null,
        practiceAttempts:0,
        words: {} 
    }
    languages.updateItem(language);
}

export async function getDecks (name){
    let decks = await languages.getItem(name);
    return decks.deck;
}

// Update when you practice a deck
export async function practiceUpdate (name, _deck) {
    let language = await languages.getItem(name);
    language.deck[_deck].lastPractice = new Date().toLocaleDateString();
    language.deck[_deck].practiceAttemps = language.deck[_deck].practiceAttemps+1;
    languages.updateItem(language);
}

//Words / phrases

export async function adduWord (name, deck, word, _translation, difficulty, _example, _notes) {
    let language = await languages.getItem(name);
    language.deck[deck].words[word] = {
        translation : _translation,
        difficulty: difficulty,
        example: _example,
        notes: _notes
    }
    languages.updateItem(language);
}

export async function getWords (name, _deck){
    let language = await languages.getItem(name);
    return language.deck[_deck].words;
}

//get words by difficulty
export async function getHardWords(name) {
    let language = await languages.getItem(name);
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