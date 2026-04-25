import FullThreePortfolioDesign1 from "./FullThreePortfolioDesign1";
import FullThreePortfolioDesign2 from "./FullThreePortfolioDesign2";
import { getThreePortfolioDesign } from "./threePortfolioShared";

function FullThreePortfolio(props) {
  const selectedDesign = getThreePortfolioDesign(props.resume?.threeDDesign);

  if (selectedDesign === "design2") {
    return <FullThreePortfolioDesign2 {...props} />;
  }

  return <FullThreePortfolioDesign1 {...props} />;
}

export default FullThreePortfolio;
