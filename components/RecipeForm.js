import { ingredients } from "@/lib/ingredients";
import { symptoms } from "@/lib/symptoms";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { getSuggestion } from "@/utils/get-suggestions";
import { useRouter } from "next/router";

const StyledForm = styled.form`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  font-size: 14px;
  border: 2px solid black;
  display: flex;
  flex-direction: column;
  margin: 5px;
  padding: 25px;
`;

const ListItemSelectedValues = styled.li`
  display: flex;
  gap: 2vw;
  border: solid grey 2px;
  border-radius: 5px;
  width: auto;
  padding: 0 2vw;
`;

const ErrorMessage = styled.div`
  color: red;
  margin: 5px 0;
`;

const StyledHeadline = styled.h2`
  text-align: center;
`;

const WhiteSpace = styled.div`
  height: 20vh;
`;

export default function RecipeForm({
  onAddRecipe,
  onEditRecipe,
  recipeToEdit,
}) {
  const [ingredientSuggestion, setIngredientSuggestion] = useState();
  const [symptomSuggestion, setSymptomSuggestion] = useState();
  const [ingredientsInput, _setIngredientsInput] = useState("");
  const [symptomsInput, _setSymptomsInput] = useState("");
  const [errorMessage, setErrorMessage] = useState({ field: "", message: "" });

  const router = useRouter();

  function setIngredientsInput(inputValue) {
    if (inputValue.includes(",")) {
    } else {
      _setIngredientsInput(inputValue);
    }
  }

  function setSymptomsInput(inputValue) {
    if (inputValue.includes(",")) {
    } else {
      _setSymptomsInput(inputValue);
    }
  }

  function handleIngredientsChange(event) {
    const userInput = event.target.value;
    getSuggestion(
      userInput,
      ingredients,
      setIngredientSuggestion,
      selectedIngredients
    );
    setIngredientsInput(userInput || "");
    setErrorMessage("");
  }

  function handleSymptomsChange(event) {
    const userInput = event.target.value;
    getSuggestion(userInput, symptoms, setSymptomSuggestion, selectedSymptoms);
    setSymptomsInput(userInput || "");
    setErrorMessage("");
  }

  const [selectedIngredients, setSelectedIngredients] = useState([]);

  async function selectSuggestedIngredient() {
    selectedIngredients.includes(ingredientSuggestion) ||
      (await setSelectedIngredients([
        ...selectedIngredients,
        ingredientSuggestion,
      ]));
    setIngredientSuggestion(null);
    setIngredientsInput("");
  }

  function selectUserIngredient(event) {
    if (
      event.key === "," &&
      ingredientsInput &&
      !selectedIngredients.includes(event.target.value.slice(0).trim())
    ) {
      setSelectedIngredients([
        ...selectedIngredients,
        event.target.value.slice(0).trim(),
      ]);
      setIngredientsInput("");
    }
  }

  function deleteSelectedIngredient(ingredientToBeDeleted) {
    setSelectedIngredients(
      selectedIngredients.filter(
        (ingredient) => ingredient !== ingredientToBeDeleted
      )
    );
  }

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  function selectSuggestedSymptom() {
    selectedSymptoms.includes(symptomSuggestion) ||
      setSelectedSymptoms([...selectedSymptoms, symptomSuggestion]);
    setSymptomsInput("");
  }

  function selectUserSymptom(event) {
    if (
      event.key === "," &&
      symptomsInput &&
      !selectedSymptoms.includes(event.target.value.slice(0).trim())
    ) {
      setSelectedSymptoms([
        ...selectedSymptoms,
        event.target.value.slice(0).trim(),
      ]);
      setSymptomsInput("");
    }
  }

  function deleteSelectedSymptom(symptomToBeDeleted) {
    setSelectedSymptoms(
      selectedSymptoms.filter((symptom) => symptom !== symptomToBeDeleted)
    );
  }

  useEffect(() => {
    recipeToEdit && setSelectedIngredients(recipeToEdit.ingredients);
  }, [recipeToEdit]);
  useEffect(() => {
    recipeToEdit && setSelectedSymptoms(recipeToEdit.symptoms);
  }, [recipeToEdit]);

  function handleSubmit(event) {
    event.preventDefault();
    if (selectedIngredients.length === 0) {
      setErrorMessage({
        field: "ingredients",
        message: "Please add at least one ingredient.",
      });
      return;
    } else if (selectedSymptoms.length === 0) {
      setErrorMessage({
        field: "symptoms",
        message: "Please add at least one symptom.",
      });
      return;
    }
    setErrorMessage({ field: "", message: "" });
    const formData = new FormData(event.target);
    const userRecipe = Object.fromEntries(formData);
    userRecipe.ingredients = [...selectedIngredients];
    userRecipe.symptoms = [...selectedSymptoms];
    recipeToEdit
      ? onEditRecipe(userRecipe, recipeToEdit)
      : onAddRecipe(userRecipe);
    event.target.reset();
    router.push("/");
  }

  return (
    <>
      <button onClick={() => router.back()}>Cancel</button>
      {recipeToEdit ? (
        <h2>Edit your Recipe</h2>
      ) : (
        <StyledHeadline>Add your Recipe</StyledHeadline>
      )}
      <StyledForm onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          placeholder="What's the recipe's name?"
          minLength="1"
          maxLength="50"
          id="title"
          name="title"
          required
          defaultValue={recipeToEdit?.title}
        ></input>
        <label htmlFor="ingredients">Ingredients</label>
        <input
          value={ingredientsInput}
          type="text"
          placeholder="Separate the ingredients by comma"
          minLength="1"
          maxLength="50"
          id="ingredients"
          name="ingredients"
          onChange={handleIngredientsChange}
          onKeyPress={selectUserIngredient}
        ></input>
        {errorMessage.field === "ingredients" && (
          <ErrorMessage>{errorMessage.message}</ErrorMessage>
        )}
        {ingredientSuggestion && (
          <div
            style={{
              cursor: "pointer",
            }}
            onClick={selectSuggestedIngredient}
          >
            Click to select suggestion: {ingredientSuggestion}
          </div>
        )}
        <ul>
          {selectedIngredients.map((ingredient) => (
            <ListItemSelectedValues key={ingredient}>
              <p>{ingredient}</p>
              <p
                style={{
                  cursor: "pointer",
                }}
                onClick={() => deleteSelectedIngredient(ingredient)}
              >
                ❌
              </p>
            </ListItemSelectedValues>
          ))}
        </ul>
        <label htmlFor="preparation">Preparation</label>
        <input
          type="text"
          placeholder="e.g Add thyme to the water"
          minLength="1"
          maxLength="150"
          required
          id="preparation"
          name="preparation"
          defaultValue={recipeToEdit?.preparation}
        ></input>
        <label htmlFor="usage">Usage</label>
        <input
          type="text"
          placeholder="How to use it?"
          minLength="4"
          maxLength="300"
          required
          id="usage"
          name="usage"
          defaultValue={recipeToEdit?.usage}
        ></input>
        <label htmlFor="symptoms">Symptoms</label>
        <input
          value={symptomsInput}
          type="text"
          placeholder="min 2 Symptoms"
          id="symptoms"
          name="symptoms"
          onChange={handleSymptomsChange}
          onKeyPress={selectUserSymptom}
        ></input>
        {errorMessage.field === "symptoms" && (
          <ErrorMessage>{errorMessage.message}</ErrorMessage>
        )}
        {symptomSuggestion && (
          <div
            style={{
              cursor: "pointer",
            }}
            onClick={selectSuggestedSymptom}
          >
            Click to select suggestion: {symptomSuggestion}
          </div>
        )}
        <ul>
          {selectedSymptoms.map((symptom) => (
            <li key={symptom}>
              <p>{symptom}</p>
              <p
                style={{
                  cursor: "pointer",
                }}
                onClick={() => deleteSelectedSymptom(symptom)}
              >
                ❌
              </p>
            </li>
          ))}
        </ul>
        <button type="submit">Save</button>
      </StyledForm>
      <WhiteSpace></WhiteSpace>
    </>
  );
}