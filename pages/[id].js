import { useRouter } from "next/router";
import RecipeDetails from "@/components/RecipeDetails";
import styled from "styled-components";
import useSWR from "swr";

const StyledRecipeDetailPage = styled.div``;

const StyledRecipeHeader = styled.div`
  display: flex;
  justify-items: center;
  justify-content: space-between;
`;

const BackLink = styled.p`
  background-color: #fcfbf4;
  padding: 10px;
  margin-top: 20px;
  margin-left: 20px;
  border-radius: 15px;
  width: 15%;
  color: black;
  text-align: center;
  font-weight: bold;
`;

const StyledRecipeBy = styled.p`
  font-size: small;
`;

const StyledHerbie = styled.p`
  font-size: x-large;
`;

const StyledHerbieBox = styled.div`
  display: flex;
  flex: columns;
`;

const ContentContainer = styled.div`
  margin-top: 10px;
`;

const WhiteSpace = styled.div`
  height: 20vh;
`;

export default function RecipeDetailsPage({
  onDeleteRecipe,
  bookmarkedRecipesIDs,
  onHandleBookmarkedIcon,
}) {
  const router = useRouter();
  const { id } = router.query;
  const {
    data: currentRecipe,
    isLoading,
    error,
  } = useSWR(`/api/recipes/${id}`);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <div>Oops! Something went wrong.</div>;
  }

  function handleBackClick(event) {
    event.preventDefault();
    router.back();
  }

  return (
    <StyledRecipeDetailPage>
      <StyledRecipeHeader>
        <BackLink href="/" onClick={handleBackClick}>
          back
        </BackLink>
        <StyledHerbieBox>
          <StyledRecipeBy>Recipe by</StyledRecipeBy>
          <StyledHerbie>herbie</StyledHerbie>
        </StyledHerbieBox>
      </StyledRecipeHeader>
      <ContentContainer>
        <RecipeDetails
          currentRecipe={currentRecipe}
          onDeleteRecipe={onDeleteRecipe}
          onHandleBookmarkedIcon={onHandleBookmarkedIcon}
          bookmarkedRecipesIDs={bookmarkedRecipesIDs}
        />
      </ContentContainer>
      <WhiteSpace />
    </StyledRecipeDetailPage>
  );
}
