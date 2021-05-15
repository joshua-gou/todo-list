import { InjectionToken } from "@angular/core";
import { CATEGORIES } from "../shared/common/enums";
import { Option } from "../shared/models";

export const CATEGORIES_TOKEN = new InjectionToken<Option[]>(
    'categories.token',
    {
        providedIn: 'root',
        factory: () => {
            return CATEGORIES;
        }
    }
);