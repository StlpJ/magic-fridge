import { useEffect, useRef, useState } from "react";
import "../styles/SearchBar.css";
import "../styles/Filter.css";
import type { ChangeEvent } from "react";
import { useFavorite } from "../contexts/FavoriteContext.tsx";
import { useTheme } from "../contexts/ThemeContext.tsx";
import type { RecipeType } from "../types/recipe.ts";
import type { Ingredient, Recipe, SearchType } from "../types/search.ts";
import { FilteredIngredients } from "./FilteredIngredients";
import RecipeCard from "./RecipeCard.tsx";
import { SelectedIngredients } from "./SelectedIngredients";
import { SuggestedRecipes } from "./SuggestedRecipes";
import Search from "../assets/images/search.png";
import Filter from "../assets/images/filter.svg";

export function SearchBar({
	recipes,
	ingredients,
}: { recipes: Recipe[]; ingredients: Ingredient[] }) {
	const [timeRecipeBar, setTimeRecipeBar] = useState<number>(120);
	const selectedTimeRecipeBar = (e: ChangeEvent<HTMLInputElement>) => {
		setTimeRecipeBar(Number(e.target.value));
	};

	const [timeIngBar, setTimeIngBar] = useState<number>(120);
	const selectedTimeIngBar = (e: ChangeEvent<HTMLInputElement>) => {
		setTimeIngBar(Number(e.target.value));
	};

	const [mealRecipeBar, setMealRecipeBar] = useState<string>("");
	const selectedMealRecipeBar = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setMealRecipeBar(e.target.value);
	};

	const [mealIngBar, setMealIngBar] = useState<string>("");
	const selectedMealIngBar = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setMealIngBar(e.target.value);
	};

	const [compatibility, setCompatibility] = useState<number>(20);
	const selectedCompatibility = (e: ChangeEvent<HTMLInputElement>) => {
		setCompatibility(Number(e.target.value));
	};

	const [open, setOpen] = useState(false);
	const [closing, setClosing] = useState(false);
	const toggleMenu = () => {
		if (open) {
			setClosing(true);
			setTimeout(() => {
				setOpen(false);
				setClosing(false);
			}, 300);
		} else {
			setOpen(true);
		}
	};
	const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>(
		[],
	);

	const [searchType, setSearchType] = useState<SearchType>("ingredient");
	const [search, setSearch] = useState<string>("");

	const filteredRecipes =
		search.trim() === ""
			? []
			: recipes.filter((recipe) =>
					recipe.strMeal?.toLowerCase()?.includes(search?.toLowerCase()),
				);

	const filteredIngredients =
		search.trim() === ""
			? []
			: ingredients.filter((ingredient) =>
					ingredient.strIngredient.toLowerCase().includes(search.toLowerCase()),
				);

	const finalRecipes = filteredRecipes
		.filter((recipe) =>
			mealRecipeBar === "" ? true : recipe.strCategory === mealRecipeBar,
		)
		.filter((recipe) => timeRecipeBar >= recipe.prTime);

	const { theme, setTheme } = useTheme();
	const { favoriteRecipes } = useFavorite();

	const favoriteIds = new Set(favoriteRecipes.map((fav) => fav.idMeal));
	const sortedFinalRecipes = [...finalRecipes].sort((a, b) => {
		const aIsFavorite = favoriteIds.has(a.idMeal);
		const bIsFavorite = favoriteIds.has(b.idMeal);
		return Number(bIsFavorite) - Number(aIsFavorite);
	});

	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div>
			<div className="search">
				<div
					className={
						searchType === "recipe"
							? "search-switch search-switch-recipe"
							: "search-switch search-switch-ingredient"
					}
				>
					<span>{searchType === "recipe" ? "Recipe" : "Ingredient"}</span>
					<input
						type="checkbox"
						checked={searchType === "ingredient"}
						id="switch"
						name="switch"
						onChange={() => {
							setSearchType(searchType !== "recipe" ? "recipe" : "ingredient");
							setTheme(!theme);
						}}
					/>
					<label htmlFor="switch">""</label>
				</div>

				<div className="search-bar">
					<input
						placeholder={
							searchType === "recipe"
								? "Search a recipe"
								: "Search by ingredients"
						}
						value={search}
						className="search-input"
						onChange={(event) => {
							setSearch(event.target.value);
						}}
					/>
					<button type="button" className="search-btn">
						<img src={Search} alt="Search icon" />
					</button>
				</div>
				{searchType === "recipe" ? (
					<div className="recipe-filter" ref={ref}>
						<button
							type="button"
							onClick={toggleMenu}
							className="button-filter"
						>
							<img src={Filter} alt="Icon filter" />
						</button>
						{(open || closing) && (
							<div
								className={`input-filter-recipe ${closing ? "closing" : "open"}`}
							>
								<label htmlFor="time">
									Preparation time : {timeRecipeBar} min
								</label>
								<input
									id="time"
									type="range"
									min="0"
									max="120"
									step="1"
									value={timeRecipeBar}
									onChange={selectedTimeRecipeBar}
									className="stick-filter"
								/>
								<div className="input-form">
									<select
										id="meal"
										value={mealRecipeBar}
										onChange={selectedMealRecipeBar}
										className="input"
									>
										<option value={""}>All</option>
										{recipes.map(
											(recipe, index) =>
												recipes.findIndex(
													(r) => r.strCategory === recipe.strCategory,
												) === index && (
													<option
														key={recipe.idMeal}
														value={recipe.strCategory ?? ""}
													>
														{recipe.strCategory}
													</option>
												),
										)}
									</select>
									<label htmlFor="meal">Meal</label>
								</div>
							</div>
						)}
					</div>
				) : (
					<div className="recipe-filter" ref={ref}>
						<button
							type="button"
							onClick={toggleMenu}
							className="button-filter"
						>
							<img src={Filter} alt="" />
						</button>
						{(open || closing) && (
							<div
								className={`input-filter-ingredient ${closing ? "closing" : "open"}`}
							>
								<label htmlFor="time">
									Preparation time : {timeIngBar} min
								</label>
								<input
									type="range"
									min="0"
									max="120"
									step="1"
									value={timeIngBar}
									onChange={selectedTimeIngBar}
									className="stick-filter"
								/>
								<div className="input-form">
									<select
										id="meal"
										value={mealIngBar}
										onChange={selectedMealIngBar}
										className="input"
									>
										<option value={""}>All</option>
										{recipes.map(
											(recipe, index) =>
												recipes.findIndex(
													(r) => r.strCategory === recipe.strCategory,
												) === index && (
													<option
														key={recipe.idMeal}
														value={recipe.strCategory ?? ""}
													>
														{recipe.strCategory}
													</option>
												),
										)}
									</select>
									<label htmlFor="meal">Meal</label>
								</div>
								<div className="input-form">
									<input
										type="number"
										min="0"
										max="20"
										step="1"
										className="input"
										value={compatibility}
										onChange={selectedCompatibility}
									/>
									<label htmlFor="number">Ingredients</label>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
			{sortedFinalRecipes.length !== 0 && searchType === "recipe" && (
				<p className="empty-recipe">
					{sortedFinalRecipes.length} recipes found
				</p>
			)}
			<div className="search-results">
				{searchType === "recipe" && (
					<div className="recipe-results-container">
						{search.trim() === "" ? null : sortedFinalRecipes.length === 0 ? (
							<div className="empty-recipe">No recipe found</div>
						) : (
							sortedFinalRecipes.map((recipe) => (
								<RecipeCard key={recipe.idMeal} recipe={recipe as RecipeType} />
							))
						)}
					</div>
				)}

				<FilteredIngredients
					searchType={searchType}
					filteredIngredients={filteredIngredients}
					selectedIngredients={selectedIngredients}
					onSelectIngredient={(ingredient) => {
						const hasAlreadyBeenAdded = selectedIngredients.some(
							(selectedIngredient) =>
								ingredient.idIngredient === selectedIngredient.idIngredient,
						);

						if (!hasAlreadyBeenAdded) {
							setSelectedIngredients([...selectedIngredients, ingredient]);
						}

						setSearch("");
					}}
				/>

				<SelectedIngredients
					onRemoveIngredient={(ingredientToRemove) => {
						const newIngredients = selectedIngredients.filter(
							(selectedIngredient) =>
								selectedIngredient.idIngredient !==
								ingredientToRemove.idIngredient,
						);
						setSelectedIngredients(newIngredients);
					}}
					selectedIngredients={selectedIngredients}
					searchType={searchType}
				/>

				<SuggestedRecipes
					selectedIngredients={selectedIngredients}
					recipes={recipes}
					searchType={searchType}
					mealIngBar={mealIngBar}
					timeIngBar={timeIngBar}
					NbrIng={compatibility}
				/>
			</div>
		</div>
	);
}
