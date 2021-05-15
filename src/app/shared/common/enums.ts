import { Option } from "../models";

export enum Category {
    All,
    Active,
    Completed
}

export const CATEGORIES: Option[] = (() => {
    return Object.entries(Category)
        .filter(category => isNaN(+category[0]))
        .map(category => {
            const [key, value] = category;
            return {
                id: value as Category,
                name: key
            };
        });
})();