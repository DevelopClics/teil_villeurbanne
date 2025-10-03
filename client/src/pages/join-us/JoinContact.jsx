import { useAuth } from "../../context/AuthContext";
import "../../App.css";

import Breadcrumbscontact from "../../components/breadcrumbs/Breadcrumbscontact";
import FormJoinus from "../../components/elements/FormJoinus";
import CarouselComponent from "../../components/Carousel/Carousel";
import EditableParagraph from "../../components/EditableParagraph";
import PageLayout from "../../components/layouts/PageLayout";

export default function JoinContact({ isNavbarHovered }) {
  const TITLE = "Nous rejoindre";
  const SUB = "Nous rejoindre";
  const { isAuthenticated } = useAuth();
  const SUBTEXT =
    "Genesia lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tationullamcorper suscipit lobortis nisl ut aliquip.";

  return (
    <>
      <CarouselComponent
        isNavbarHovered={isNavbarHovered}
        category="join"
        carouselTextId={10}
        isEditable={isAuthenticated}
        stationaryText={false}
        startFaded={true}
      />
      <Breadcrumbscontact breadcrumbsnav={TITLE} />
      <PageLayout
        title={SUB}
        titleId="join-us-title"
        DescriptionComponent={
          <>
            <EditableParagraph
              textId="join-us-paragraph"
              initialContent="Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat."
              isEditable={isAuthenticated}
            />
            <FormJoinus />
          </>
        }
      />
    </>
  );
}
