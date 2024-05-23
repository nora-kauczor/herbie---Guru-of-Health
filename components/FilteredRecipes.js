import { useState } from "react";
import RecipeList from "./RecipeList";
import { SearchSectionAndRecipeListWrapper, SearchBox, StyledFilterForm, Searchfield, StyledSuggestionsList, StyledTextSuggestion, Selection, StyledSelectedSuggestion, StyledCross, ResetButton, SearchBoxAndSelectionWrapper } from "./FilteredRecipes.styles";


export default function FilteredRecipes({
  recipes,
  bookmarkedRecipesIDs,
  onToggleBookmark,
}) {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptomSuggestions, setSymptomSuggestions] = useState([]);

  function handleSymptomsChange(event) {
    const userInput = event.target.value;
    setSymptomSuggestions([]);
    const suggestions = recipes.reduce((acc, recipe) => {
      const matchingSymptoms = recipe.symptoms.filter((symptom) =>
        symptom.toLowerCase().startsWith(userInput.toLowerCase())
      );
      return [...acc, ...matchingSymptoms];
    }, []);
    const notYetSelectedSuggestions = suggestions.filter(
      (suggestion) => !selectedSymptoms.includes(suggestion)
    );
    setSymptomSuggestions(Array.from(new Set(notYetSelectedSuggestions)));
  }

  function handleSymptomSuggestionClick(suggestion) {
    setSelectedSymptoms((prevSelectedSymptoms) => [
      ...prevSelectedSymptoms,
      suggestion,
    ]);
    setSymptomSuggestions([]);
    setUserInput("");
  }

  function removeSelectedSymptom(index) {
    setSelectedSymptoms((prevSelectedSymptoms) => {
      const updatedSymptoms = [...prevSelectedSymptoms];
      updatedSymptoms.splice(index, 1);
      return updatedSymptoms;
    });
  }

  function filterRecipes() {
    let filteredRecipes = [...recipes];
    if (selectedSymptoms.length > 0) {
      filteredRecipes = filteredRecipes.filter((recipe) =>
        selectedSymptoms.every((symptom) => recipe.symptoms.includes(symptom))
      );
    }
    return filteredRecipes;
  }

  const filteredRecipes = filterRecipes();

  function handleSearchSubmit(event) {
    event.preventDefault();
    event.target.reset();
  }

  const [userInput, setUserInput] = useState("");

  function handleResetSubmit(event) {
    event.preventDefault();
    setSelectedSymptoms([]);
    setUserInput("");
  }

  return (
    <SearchSectionAndRecipeListWrapper>
      <SearchBoxAndSelectionWrapper>
      <SearchBox>
        <StyledFilterForm onSubmit={handleSearchSubmit}>
          <Searchfield
            placeholder="Type your symptom and select from the list 🔍"
            type="text"
            id="symptom"
            name="inputfield"
            onChange={(event) => {
              handleSymptomsChange(event);
              setUserInput(event.target.value);
            }}
            value={userInput}
          />
          <StyledSuggestionsList>
            {userInput &&
              symptomSuggestions.map((suggestion) => (
                <StyledTextSuggestion
                  key={suggestion}
                  onClick={() => handleSymptomSuggestionClick(suggestion)}
                >
                  {suggestion}
                </StyledTextSuggestion>
              ))}
          </StyledSuggestionsList>

        </StyledFilterForm>
        <ResetButton onClick={handleResetSubmit}>Reset</ResetButton>
        </SearchBox>

        <Selection>
            {selectedSymptoms.map((symptom) => (
              <StyledSelectedSuggestion key={symptom}>
                {symptom}{" "}
                <StyledCross onClick={() => removeSelectedSymptom(symptom)}>
                  ✖️
                </StyledCross>
              </StyledSelectedSuggestion>
            ))}
          </Selection>
      </SearchBoxAndSelectionWrapper>
      <RecipeList
        bookmarkedRecipesIDs={bookmarkedRecipesIDs}
        recipes={filteredRecipes}
        onToggleBookmark={onToggleBookmark}
      />
    </SearchSectionAndRecipeListWrapper>
  );
}
