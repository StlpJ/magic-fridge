import {
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import type { Recipe } from "../types/meal";
import { computeCaloriesPer100g, fetchNutrition } from "../utils/calorieApi";

type CaloriesByMealId = Record<string, number | null>;

type CaloriesContextValue = {
	caloriesByMealId: CaloriesByMealId;
	getCaloriesPer100gForMeal: (meal: Recipe) => Promise<number | null>;
};

const CaloriesContext = createContext<CaloriesContextValue | undefined>(
	undefined,
);

type CaloriesProviderProps = {
	children: ReactNode;
};

function extractIngredients(meal: Recipe): string[] {
	const list: string[] = [];
	const listFinal: string[] = [];

	const ing = Object.values(meal).slice(9, 29);
	const measure = Object.values(meal).slice(29, 49);

	for (let i = 0; i <= 19; i++) {
		if (
			typeof ing[i] !== "string" ||
			ing[i] !== "" ||
			ing[i] !== " " ||
			typeof measure[i] === "string" ||
			measure[i] !== "" ||
			measure[i] !== " "
		) {
			const calorieSearch = ((measure[i] as string) + ing[i]) as string;
			list.push(calorieSearch);
		}
	}

	for (let i = 0; i <= 19; i++) {
		if (list[i] !== " " && list[i] !== "") {
			listFinal.push(list[i]);
		}
	}

	return listFinal;
}

export function CaloriesProvider({ children }: CaloriesProviderProps) {
	const [caloriesByMealId, setCaloriesByMealId] = useState<CaloriesByMealId>(
		{},
	);

	const getCaloriesPer100gForMeal = useCallback(
		async (meal: Recipe) => {
			const mealId = meal.idMeal;

			if (!mealId) {
				return null;
			}

			if (mealId in caloriesByMealId) {
				return caloriesByMealId[mealId];
			}

			const ingredients = extractIngredients(meal);

			if (ingredients.length === 0) {
				setCaloriesByMealId((prev) => ({
					...prev,
					[mealId]: null,
				}));
				return null;
			}

			const query = ingredients.join(", ");
			const data = await fetchNutrition(query);
			const per100 = computeCaloriesPer100g(data);

			setCaloriesByMealId((prev) => ({
				...prev,
				[mealId]: per100,
			}));

			return per100;
		},
		[caloriesByMealId],
	);

	const value = useMemo(
		() => ({
			caloriesByMealId,
			getCaloriesPer100gForMeal,
		}),
		[caloriesByMealId, getCaloriesPer100gForMeal],
	);

	return (
		<CaloriesContext.Provider value={value}>
			{children}
		</CaloriesContext.Provider>
	);
}

export function useCalories() {
	const context = useContext(CaloriesContext);

	if (!context) {
		throw new Error("useCalories must be used within a CaloriesProvider");
	}

	return context;
}
