import  axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        const key = 'c117c90e2673cc65c6ce5c24d9655b45';
        try {
            const result = await axios(`https://cors-anywhere.herokuapp.com/http://food2fork.com/api/search?key=${key}&q=${this.query}`);
             this.recipes = result.data.recipes
            //console.log(this.recipes);
        } catch(error) {
            alert(error);
        } 
    }
}
