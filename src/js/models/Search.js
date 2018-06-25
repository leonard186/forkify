import  axios from 'axios';
import {proxy, key} from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            const result = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
             this.recipes = result.data.recipes
            //console.log(this.recipes);
        } catch(error) {
            alert(error);
        } 
    }
}
