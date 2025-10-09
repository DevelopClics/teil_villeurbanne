import { useAuth } from "../../context/AuthContext";
import "../../App.css";
import CarouselComponent from "../../components/Carousel/Carousel";
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import PageLayout from "../../components/layouts/PageLayout";
import DropProjectDescription from "../../components/DropProjectDescription";

export default function DropProject({ isNavbarHovered }) {
  const SUB = "Déposer un projet";
  const { isAuthenticated } = useAuth();

  return (
    <>
      <CarouselComponent
        isNavbarHovered={isNavbarHovered}
        category="drop-project"
        carouselTextId={9}
        isEditable={isAuthenticated}
        stationaryText={false}
        startFaded={true}
      />
      <Breadcrumbs breadcrumbsnav="Qui sommes-nous ?" breadcrumbssub={SUB} />
      <PageLayout
        title={SUB}
        titleId="drop-project-title"
        DescriptionComponent={<DropProjectDescription />}
      />
    </>
  );
}
