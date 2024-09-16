import { Carousel } from "./HomePage/Carousel";
import { ExploreTopBooks } from "./HomePage/ExploreTopBooks";
import { Heros } from "./HomePage/Heros";
import { LibraryServices } from "./HomePage/LibraryServices";

export const HomePage = () => {
  return (
    <>
      <ExploreTopBooks />
      <Carousel />
      <Heros />
      <LibraryServices />
    </>
  );
};
