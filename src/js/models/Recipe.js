import axios from 'axios';
import {proxy, key} from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const result = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = result.data.recipe.title;
            this.author = result.data.recipe.publisher;
            this.img = result.data.recipe.image_url;
            this.url = result.data.recipe.source_url;
            this.ingredients = result.data.recipe.ingredients;
        } catch (error) {
            console.log(error)
            alert('Something went wrong :(');
        }
    }

    calcTime() {
        //15 minutes for each 3 ingredients
        const numberOfIngredients = this.ingredients.length;
        const periods = Math.ceil(numberOfIngredients / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g']


        const newIngredients = this.ingredients.map(el => {
            //1. uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            //2. remove parantheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

            //3. parse ingredients into count, unit and ingredient
            const arrayIngredient = ingredient.split(' ');
            const unitIndex = arrayIngredient.findIndex(el2 => units.includes(el2));

            let objIng;
            if(unitIndex > -1) {
                //There is a unit
                    //Ex 4 1/2 cups, arrayCount is [4, 1/2]
                    //Ex 4 cups, arrayCount is [4]
                const arrayCount = arrayIngredient.slice(0, unitIndex); 

                let count;
                if(arrayCount.length === 1) {
                    count = arrayIngredient[0].replace('-', '+');
                } else {
                    count = eval(arrayIngredient.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrayIngredient[unitIndex],
                    ingredient: arrayIngredient.slice(unitIndex + 1).join(' ')
                };

            } else if(parseInt(arrayIngredient[0], 10)) {
                //There is NO unit but 1st element is a number
                objIng = {
                    count: parseInt(arrayIngredient[0], 10),
                    unit: '',
                    ingredient: arrayIngredient.slice(1).join(' ')
                }
            } else if(unitIndex === -1) {
                //There is NO unit and NO number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient: ingredient
                }
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings(type) {
        //update Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
        //update Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}