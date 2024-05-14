import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";
import { RiArrowDropDownLine } from "react-icons/ri";
import Image from "next/image";
import { BookmarkIcon } from "./BookmarkIcon";

const RecipeArticle = styled.article`
  background-color: #fcfbf4;
  margin-inline: 15px;
  border-radius: 20px;
  position: relative;
`;

const StyledRecipeDetailPicture = styled.div`
  border-radius: 20px 20px 0 0;
  width: 100%;
  height: 180px;
  position: relative;
`;

const StyledBookmarkIcon = styled.div`
  width: 40px;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
`;

const StyledImage = styled(Image)`
  border-radius: 20px 20px 0 0;
`;

const SytledRecipeTitle = styled.h2`
  margin-left: 20px;
  font-size: xx-large;
`;

const StyledItemsBox = styled.div`
  list-style: none;
  display: flex;
  align-items: center;
  gap: 5px;
  padding-bottom: 10px;
`;

const StyledItemListTitle = styled.h3`
  margin-left: 20px;
  font-size: medium;
  margin-left: 20px;
`;

const StyleItemsList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 10px;
`;

const StyledItems = styled.li`
  background-color: #f1efe2;
  border-radius: 10px;
  text-align: center;
  padding: 5px;
`;

const CollapsibleContainer = styled.div`
  margin-bottom: 10px;
`;

const CollapsibleButton = styled.div`
  background-color: #dedbdb;
  color: black;
  cursor: pointer;
  padding: 2px;
  margin: 5px;
  border-radius: 7px;
  border: solid black 1px;
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const StyledIcon = styled(RiArrowDropDownLine)`
  font-size: 40px;
`;

const StyledTextButton = styled.p`
  font-size: medium;
  text-align: center;
`;

const CollapsibleContent = styled.div`
  padding: 0 18px;
  margin: 5px;
  overflow: hidden;
  background-color: #f1f1f1;
  max-height: ${(props) => (props.isOpen ? "500px" : "0")};
  transition: max-height 0.3s ease-out;
`;

const CollapsibleText = styled.p`
  font-size: medium;
`;

const EditButton = styled.button`
  background-color: #ffc107;
  height: 32px;
  width: 64px;
  color: white;
  font-size: medium;
  border-radius: 7px;
  border: none;
`;

const DeleteButton = styled.button`
  background-color: #ff0000;
  height: 32px;
  width: 64px;
  color: white;
  font-size: medium;
  border-radius: 7px;
  border: none;
`;

const ButtonsBox = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
  padding-bottom: 10px;
`;

export default function RecipeDetails({
  currentRecipe,
  onDeleteRecipe,
  bookmarkedRecipesIDs,
  onHandleBookmarkedIcon,
}) {
  const router = useRouter();
  const { title, ingredients, preparation, usage, symptoms, image } =
    currentRecipe;

  const [isPreparationOpen, setIsPreparationOpen] = useState(false);
  const [isUsageOpen, setIsUsageOpen] = useState(false);

  const togglePreparationCollapse = () => {
    setIsPreparationOpen(!isPreparationOpen);
  };

  const toggleUsageCollapse = () => {
    setIsUsageOpen(!isUsageOpen);
  };

  function handleClick() {
    router.push(`/edit/${currentRecipe._id}`);
  }

  function handleDelete() {
    if (confirm("Are you sure you want to delete this recipe?")) {
      onDeleteRecipe(currentRecipe._id);
      router.push("/");
    }
  }

  console.log(currentRecipe);

  return (
    <RecipeArticle aria-label="Recipe Details">
      <StyledBookmarkIcon>
        <BookmarkIcon
          onHandleBookmarkedIcon={onHandleBookmarkedIcon}
          bookmarkedRecipesIDs={bookmarkedRecipesIDs}
          recipe={currentRecipe}
        />
      </StyledBookmarkIcon>
      <StyledRecipeDetailPicture>
        <StyledImage
          src={image}
          layout="fill"
          objectFit="cover"
          alt="bottle of rum e.g. remedy"
        />
      </StyledRecipeDetailPicture>
      <SytledRecipeTitle>{title}</SytledRecipeTitle>
      <StyledItemsBox>
        <StyledItemListTitle>Ingredients:</StyledItemListTitle>
        <StyleItemsList>
          {ingredients.map((ingredient, index) => (
            <StyledItems key={index}>{ingredient}</StyledItems>
          ))}
        </StyleItemsList>
      </StyledItemsBox>
      <CollapsibleContainer>
        <CollapsibleButton onClick={togglePreparationCollapse}>
          <StyledTextButton>Preparation</StyledTextButton>
          <StyledIcon />
        </CollapsibleButton>
        <CollapsibleContent isOpen={isPreparationOpen}>
          <CollapsibleText>{preparation}</CollapsibleText>
        </CollapsibleContent>

        <CollapsibleButton onClick={toggleUsageCollapse}>
          Usage
          <StyledIcon />
        </CollapsibleButton>

        <CollapsibleContent isOpen={isUsageOpen}>
          <CollapsibleText>{usage}</CollapsibleText>
        </CollapsibleContent>
      </CollapsibleContainer>
      <StyledItemsBox>
        <StyledItemListTitle> Symptoms</StyledItemListTitle>
        <StyleItemsList>
          {symptoms.map((symptoms, index) => (
            <StyledItems key={index}>{symptoms}</StyledItems>
          ))}
        </StyleItemsList>
      </StyledItemsBox>
      <ButtonsBox>
        {currentRecipe.editable && (
          <EditButton onClick={handleClick}>Edit</EditButton>
        )}
        {currentRecipe.editable && (
          <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
        )}
      </ButtonsBox>
    </RecipeArticle>
  );
}
