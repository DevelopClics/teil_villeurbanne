import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Navigation from "./components/Navbar/Navbar";
import "./App.css";
import Footer from "./components/Footer/Footer";
import TopHeader from "./components/TopHeader/TopHeader";
import { useAuth } from "./context/AuthContext";

const Home = lazy(() => import("./pages/Home"));
const Contact = lazy(() => import("./pages/Contact"));
const Team = lazy(() => import("./pages/about/Team"));
const Genesis = lazy(() => import("./pages/about/Genesis"));
const Places = lazy(() => import("./pages/about/Places"));
const AllProj = lazy(() => import("./pages/projects/AllProj"));

// PRIVATE ROUTES
const ProductList = lazy(() => import("./pages/admin/products/ProductList"));
const CreateProduct = lazy(() =>
  import("./pages/admin/products/CreateProduct")
);
const EditProduct = lazy(() => import("./pages/admin/products/EditProduct"));
const PlaceListAdmin = lazy(() =>
  import("./pages/admin/places/PlaceListAdmin")
);
const EditPlace = lazy(() => import("./pages/admin/places/EditPlace"));
const CreatePlace = lazy(() => import("./pages/admin/places/CreatePlace"));
const Login = lazy(() => import("./pages/admin/Login"));

import PrivateRoutes from "./utils/PrivateRoutes";
import DropProject from "./pages/projects/DropProject";
const JoinContact = lazy(() => import("./pages/join-us/JoinContact"));

import ProjectCategoryPage from "./pages/projects/ProjectCategoryPage";
import ScrollToTop from "./components/ScrollToTop";
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isNavbarHovered, setIsNavbarHovered] = useState(false);
  const socialIconsRef = useRef(null);
  const socialIconsTargetRef = useRef(null);
  const socialIconsContainerRef = useRef(null);
  const [show, setShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState("");
  const { isServerOnline } = useAuth();

  const handleClose = () => setShow(false);
  const handleShow = (title, body) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setModalTitle(title);
      setModalBody(body);
      setShow(true);
    }, 500); // Delay to allow for scroll animation
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (screenWidth < 768) {
      if (socialIconsRef.current && socialIconsTargetRef.current) {
        socialIconsTargetRef.current.appendChild(socialIconsRef.current);
      }
    } else {
      if (socialIconsRef.current && socialIconsContainerRef.current) {
        socialIconsContainerRef.current.appendChild(socialIconsRef.current);
      }
    }
  }, [screenWidth]);

  const getBreakpoint = (width) => {
    if (width < 576) {
      return "XS";
    } else if (width >= 576 && width < 768) {
      return "sm";
    } else if (width >= 768 && width < 992) {
      return "md";
    } else if (width >= 992 && width < 1200) {
      return "lg";
    } else if (width >= 1200 && width < 1400) {
      return "xl";
    } else {
      return "xxl";
    }
  };

  return (
    <>
      <ScrollToTop />
      <div className="top-blue-bar">
        {/* {screenWidth}px - {getBreakpoint(screenWidth)} */}
      </div>
      <div className={show ? "blur-background" : ""}>
        <TopHeader
          socialIconsRef={socialIconsRef}
          socialIconsContainerRef={socialIconsContainerRef}
          onElementHover={setIsNavbarHovered}
          isServerOnline={isServerOnline}
        />
        <Navigation
          onDropdownHoverChange={setIsNavbarHovered}
          socialIconsTargetRef={socialIconsTargetRef}
        />
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route
              path="/admin/products"
              element={
                <Suspense fallback={<div>Chargement…</div>}>
                  <ProductList />
                </Suspense>
              }
            />
            <Route
              path="/admin/products/create"
              element={
                <Suspense fallback={<div>Chargement…</div>}>
                  <CreateProduct />
                </Suspense>
              }
            />
            <Route
              path="/admin/products/edit/:id"
              element={
                <Suspense fallback={<div>Chargement…</div>}>
                  <EditProduct />
                </Suspense>
              }
            />
            <Route
              path="/admin/places"
              element={
                <Suspense fallback={<div>Chargement…</div>}>
                  <PlaceListAdmin />
                </Suspense>
              }
            />
            <Route
              path="/admin/places/edit/:id"
              element={
                <Suspense fallback={<div>Chargement…</div>}>
                  <EditPlace />
                </Suspense>
              }
            />
            <Route
              path="/admin/places/create"
              element={
                <Suspense fallback={<div>Chargement…</div>}>
                  <CreatePlace />
                </Suspense>
              }
            />
          </Route>
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={<div>Chargement…</div>}>
                <Login />
              </Suspense>
            }
          />
          <Route
            path="/"
            element={
              <Suspense fallback={<div>Chargement…</div>}>
                <Home isNavbarHovered={isNavbarHovered} />
              </Suspense>
            }
          />
          <Route
            path="/joinus-contact"
            element={
              <Suspense fallback={<div>Chargement…</div>}>
                <JoinContact isNavbarHovered={isNavbarHovered} />
              </Suspense>
            }
          />
          <Route
            path="/contact"
            element={
              <Suspense fallback={<div>Chargement…</div>}>
                <Contact isNavbarHovered={isNavbarHovered} />
              </Suspense>
            }
          />
          {/* QUI SOMMES NOUS   */}
          <Route
            path="/genesis"
            element={
              <Suspense fallback={<div>Chargement…</div>}>
                <Genesis isNavbarHovered={isNavbarHovered} />
              </Suspense>
            }
          />
          <Route
            path="/team"
            element={
              <Suspense fallback={<div>Chargement…</div>}>
                <Team isNavbarHovered={isNavbarHovered} />
              </Suspense>
            }
          />
          <Route
            path="/places"
            element={
              <Suspense fallback={<div>Chargement…</div>}>
                <Places isNavbarHovered={isNavbarHovered} />
              </Suspense>
            }
          />
          {/* TOUS LES PROJETS   */}
          <Route
            path="/all-projects"
            element={
              <Suspense fallback={<div>Chargement…</div>}>
                <AllProj isNavbarHovered={isNavbarHovered} />
              </Suspense>
            }
          />

          <Route
            path="/projects/:category/:id"
            element={
              <Suspense fallback={<div>Chargement…</div>}>
                <ProjectCategoryPage isNavbarHovered={isNavbarHovered} />
              </Suspense>
            }
          />
          <Route
            path="/projects/:category"
            element={
              <Suspense fallback={<div>Chargement…</div>}>
                <ProjectCategoryPage isNavbarHovered={isNavbarHovered} />
              </Suspense>
            }
          />

          <Route
            path="/drop-project"
            element={
              <Suspense fallback={<div>Chargement…</div>}>
                <DropProject isNavbarHovered={isNavbarHovered} />
              </Suspense>
            }
          />

          {/* <Route path="*" element={<NotFound />} /> */}
          <Route
            path="*"
            element={
              <Suspense fallback={<div>Chargement…</div>}>
                <NotFound />
              </Suspense>
            }
          />
        </Routes>
      </div>
      <Footer
        show={show}
        handleClose={handleClose}
        handleShow={handleShow}
        modalTitle={modalTitle}
        modalBody={modalBody}
      />

      <div className="bottom-blue-bar"></div>
    </>
  );
}

export default App;
