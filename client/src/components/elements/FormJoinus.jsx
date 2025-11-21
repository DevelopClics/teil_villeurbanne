import { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { FloatingLabel } from "react-bootstrap";
import { useForm } from "react-hook-form";
import "./FormContact.css";
import Button from "react-bootstrap/Button";
import { Form, Row, Col } from "react-bootstrap";
import "../layouts/ProjectLayout.css";
import LinkBox from "./LinkBox";

const FormJoinus = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors, isValid, isSubmitted, touchedFields },
    handleSubmit,
    trigger,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      status: "",
      requestSelect: "",
      habitantRequestSelect: "",
      associationRequestSelect: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendEmail = () => {
    setIsSubmitting(true);
    // e.preventDefault();
    emailjs
      .sendForm(
        "service_lusfaln",
        "template_ysphumj",
        form.current,
        "XrymAP2hWRxDAPrvE"
        // awYJXfOvl5Y_Sx9cQ
      )
      .then(
        (result) => {
          console.log(result.text);
          setIsSubmitting(false);
          window.location.reload();
        },
        (error) => {
          console.log(error.text);
          <p>NON</p>;
          setIsSubmitting(false);
        }
      );
    form.current.reset();
  };

  const VOLUNTEER = "Etre bénèvole sur un projet",
    COMPANY = "Association, entreprise",
    STUDENT = "Elève, étudiant",
    HOME_NETWORK = "Faire partie du réseau d'hébergement ponctuel",
    MORE_INFO = "Avoir plus d'information sur l'accompagnement de l'ADCT",
    PROJECT = "Proposer un projet entre Le Teil et Villeurbanne",
    INTERNSHIP = "Accueillir un jeune en stage";

  const form = useRef();
  const [showOptionsCompany, setShowOptionsCompany] = useState(false);
  const [showOtherTextarea, setShowOtherTextarea] = useState(false);
  const [showMyProjectTextarea, setShowMyProjectTextarea] = useState(false);
  const [showRequestSelect, setShowRequestSelect] = useState(false);
  const [showHabitantRequestSelect, setShowHabitantRequestSelect] =
    useState(false);
  const [showHomeNetworkLinks, setShowHomeNetworkLinks] = useState(false);
  const [showInternshipLinks, setShowInternshipLinks] = useState(false);
  const [placeholderText, setPlaceholderText] = useState(
    "Autres envies/besoins"
  );

  const status = watch("status");
  const requestSelectValue = watch("requestSelect");
  const habitantRequestSelectValue = watch("habitantRequestSelect");
  const associationRequestSelectValue = watch("associationRequestSelect");

  useEffect(() => {
    const isEleve = status === STUDENT;
    const isHabitant = status === "habitant";
    const isCompany = status === COMPANY;

    setShowRequestSelect(isEleve);
    setShowHabitantRequestSelect(isHabitant);
    setShowOptionsCompany(isCompany);

    if (!isEleve) {
      setValue("requestSelect", "");
    }
    if (!isHabitant) {
      setValue("habitantRequestSelect", "");
    }
    if (!isCompany) {
      setValue("associationRequestSelect", "");
    }
  }, [status, setValue]);

  useEffect(() => {
    const show =
      (status === STUDENT &&
        (requestSelectValue === "Autre" ||
          requestSelectValue === "logement" ||
          requestSelectValue === "Un stage" ||
          requestSelectValue === VOLUNTEER)) ||
      (status === "habitant" &&
        (habitantRequestSelectValue === "Autre" ||
          habitantRequestSelectValue === HOME_NETWORK ||
          habitantRequestSelectValue === VOLUNTEER)) ||
      (status === COMPANY &&
        (associationRequestSelectValue === "Autre" ||
          associationRequestSelectValue === MORE_INFO ||
          associationRequestSelectValue === INTERNSHIP));
    setShowOtherTextarea(show);
  }, [
    status,
    requestSelectValue,
    habitantRequestSelectValue,
    associationRequestSelectValue,
    VOLUNTEER,
    HOME_NETWORK,
    MORE_INFO,
    INTERNSHIP,
  ]);

  useEffect(() => {
    const show =
      status === COMPANY && associationRequestSelectValue === PROJECT;
    setShowMyProjectTextarea(show);
  }, [status, associationRequestSelectValue]);

  useEffect(() => {
    trigger("message");
  }, [showOtherTextarea, trigger]);

  useEffect(() => {
    trigger("my_object");
  }, [showMyProjectTextarea, trigger]);

  useEffect(() => {
    setShowHomeNetworkLinks(habitantRequestSelectValue === HOME_NETWORK);
  }, [habitantRequestSelectValue, HOME_NETWORK]);

  useEffect(() => {
    setShowInternshipLinks(
      status === COMPANY && associationRequestSelectValue === INTERNSHIP
    );
  }, [status, associationRequestSelectValue, COMPANY, INTERNSHIP]);

  useEffect(() => {
    let newPlaceholder = "Autres envies/besoins";
    if (status === STUDENT) {
      if (requestSelectValue === "logement")
        newPlaceholder =
          "Précisez le type de logement, la localisation, et vos dates si possible.";
      else if (requestSelectValue === "Un stage")
        newPlaceholder =
          "Indiquez le domaine du stage, la durée et la période souhaitée.";
      else if (requestSelectValue === VOLUNTEER)
        newPlaceholder =
          "Sur quel type de projet ou de mission souhaitez-vous vous positionner ?";
    } else if (status === "habitant") {
      if (habitantRequestSelectValue === HOME_NETWORK)
        newPlaceholder =
          "Décrivez le type d'hébergement que vous proposez (chambre, canapé...), les disponibilités, etc.";
      else if (habitantRequestSelectValue === VOLUNTEER)
        newPlaceholder =
          "Sur quel type de projet ou de mission souhaitez-vous vous positionner ?";
    } else if (status === COMPANY) {
      if (associationRequestSelectValue === MORE_INFO)
        newPlaceholder =
          "Quelles sont les informations que vous souhaitez recevoir ?";
      else if (associationRequestSelectValue === INTERNSHIP)
        newPlaceholder =
          "Décrivez l'offre de stage (missions, durée, profil recherché).";
    }
    setPlaceholderText(newPlaceholder);
  }, [
    status,
    requestSelectValue,
    habitantRequestSelectValue,
    associationRequestSelectValue,
    VOLUNTEER,
    HOME_NETWORK,
    MORE_INFO,
    INTERNSHIP,
  ]);

  return (
    <Form
      ref={form}
      onSubmit={handleSubmit(sendEmail)}
      className="px-0 px-ld-0"
    >
      <Row className="mb-1">
        <Col lg={4}>
          <Form.Group controlId="formBasicPrenom">
            <span className="error text-danger">
              {errors.from_firstname?.type === "minLength" &&
                "Ecrire plus de 2 caractères"}
              {errors.from_firstname?.type === "maxLength" &&
                "Ecrire moins de 20 caractères"}
              {errors.from_firstname?.type === "pattern" &&
                "Ecrire uniquement des lettres"}
              {touchedFields.from_firstname &&
                !watch("from_firstname") &&
                "Entrez votre prénom - facultatif"}
            </span>
            <Form.Control
              type="text"
              placeholder="Prénom"
              name="from_firstname"
              isInvalid={!!errors.from_firstname}
              {...register("from_firstname", {
                required: false,
                minLength: 3,
                maxLength: 19,
                pattern: /^[A-Za-z]+$/i,
              })}
            />
          </Form.Group>
        </Col>
        <Col lg={4}>
          <Form.Group controlId="formBasicNom">
            <span className="error text-danger">
              {errors.from_lastname?.type === "required" &&
                "Entrez votre nom - requis"}
              {errors.from_lastname?.type === "minLength" &&
                "Ecrire plus de 2 caractères"}
              {errors.from_lastname?.type === "maxLength" &&
                "Ecrire moins de 20 caractères"}
              {errors.from_lastname?.type === "pattern" &&
                "Ecrire uniquement des lettres"}
              {touchedFields.from_firstname &&
                !watch("from_lastname") &&
                "Entrez votre nom - facultatif"}
            </span>
            <Form.Control
              type="text"
              placeholder="Nom"
              name="from_lastname"
              isInvalid={!!errors.from_lastname}
              {...register("from_lastname", {
                required: false,
                minLength: 3,
                maxLength: 19,
                pattern: /^[A-Za-z]+$/i,
              })}
            />
          </Form.Group>
        </Col>
        <Col lg={4}>
          <Form.Group controlId="formBasicEmail">
            <span className="error text-danger">
              {errors.from_email?.type === "required" &&
                "Entrez votre adresse e-mail - requis"}
              {errors.from_email?.type === "pattern" &&
                "L'email n'a pas un format correct"}
              {errors.from_email?.type === "minLength" &&
                "Ecrire plus de 14 caractères"}
              {errors.from_email?.type === "maxLength" &&
                "Ecrire 30 caractères au maximum"}
            </span>
            <Form.Control
              type="email"
              placeholder="Email"
              name="from_email"
              isInvalid={!!errors.from_email}
              {...register("from_email", {
                required: true,
                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              })}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={8}>
          <Row className="mb-4">
            <Col lg={6}>
              <Form.Group controlId="formBasicObjet">
                <span className="error text-danger">
                  {errors.object?.type === "minLength" &&
                    "Ecrire 10 caractères au minimum"}
                  {errors.object?.type === "maxLength" &&
                    "Ecrire moins de 50 caractères"}
                  {touchedFields.from_firstname &&
                    !watch("from_lastname") &&
                    "Indiquez l'objet de l'email - facultatif"}
                </span>
                <Form.Control
                  type="text"
                  placeholder="Objet"
                  name="object"
                  isInvalid={!!errors.object}
                  {...register("object", {
                    required: false,
                    minLength: 10,
                    maxLength: 49,
                    pattern: /^[a-zA-Z0-9\s]+$/,
                  })}
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group controlId="formBasicVille">
                <span className="error text-danger">
                  {errors.city?.type === "required" &&
                    "Indiquez votre ville ou village"}
                  {errors.city?.type === "minLength" &&
                    "Ecrire 2 caractères au minimum"}
                  {errors.city?.type === "maxLength" &&
                    "Ecrire moins de 30 caractères"}
                  {errors.city?.type === "pattern" &&
                    "Ecrire uniquement des lettres, espaces et tirets"}
                </span>
                <Form.Control
                  type="text"
                  placeholder="Ville"
                  name="city"
                  isInvalid={!!errors.city}
                  {...register("city", {
                    required: true,
                    minLength: 2,
                    maxLength: 29,
                    pattern: /^[A-Za-z -]+$/i,
                  })}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-1">
            <Col lg={6} className="mb-4 mb-lg-0">
              <Form.Group controlId="formBasicSelect1">
                <Form.Select
                  aria-label="Default select example"
                  name="status"
                  {...register("status", { required: false })}
                >
                  <option value="" className="text-center">
                    -- Je suis --
                  </option>
                  <option value={COMPANY}>{COMPANY}</option>
                  <option value="habitant">Habitant</option>
                  <option value={STUDENT}>{STUDENT}</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group controlId="formBasicSelect2">
                {showRequestSelect && (
                  <Form.Select
                    aria-label="Default select example"
                    name="requestSelect"
                    {...register("requestSelect", { required: false })}
                  >
                    <option value="" className="text-center">
                      -- Je cherche --
                    </option>
                    <option value="logement">Un logement</option>
                    <option value="Un stage">Un stage</option>
                    <option value={VOLUNTEER}>{VOLUNTEER}</option>
                    <option value="Autre">Autre</option>
                  </Form.Select>
                )}

                {showHabitantRequestSelect && (
                  <Form.Select
                    aria-label="Habitant request select"
                    name="habitantRequestSelect"
                    {...register("habitantRequestSelect", { required: false })}
                  >
                    <option value="" className="text-center">
                      -- Je souhaite --{" "}
                    </option>
                    <option
                      value={HOME_NETWORK}
                      style={{ whiteSpace: "normal" }}
                    >
                      {HOME_NETWORK}
                    </option>
                    <option value={VOLUNTEER}>{VOLUNTEER}</option>
                    <option value="Autre">Autre</option>
                  </Form.Select>
                )}

                {showOptionsCompany && (
                  <Form.Select
                    aria-label="Association request select"
                    name="associationRequestSelect"
                    {...register("associationRequestSelect", {
                      required: false,
                    })}
                  >
                    <option value="" className="text-center">
                      -- Je souhaite --
                    </option>
                    <option value={PROJECT}>{PROJECT}</option>
                    <option value={MORE_INFO}>{MORE_INFO}</option>
                    <option value={INTERNSHIP}>{INTERNSHIP}</option>
                    <option value="Autre">Autre</option>
                  </Form.Select>
                )}
              </Form.Group>
            </Col>
          </Row>{" "}
        </Col>

        <Col lg={4}>
          {showHabitantRequestSelect && showHomeNetworkLinks && (
            <LinkBox
              title="Accueil solidaire chez l'habitant·e"
              link1_text="Le Teil"
              link1_href="https://framaforms.org/accueil-solidaire-chez-lhabitante-au-teil-1756226187"
              link2_text="Villeurbanne/Lyon"
              link2_href="https://framaforms.org/accueil-solidaire-chez-lhabitante-a-villeurbannelyon-1751563637"
            />
          )}
          {showInternshipLinks && (
            <LinkBox
              title="Accueil de stagiaires"
              link1_text="Adéchois"
              link1_href="https://framaforms.org/accueil-de-stagiaires-ardechois-1751562246 "
              link2_text="Villeurbannais"
              link2_href="https://framaforms.org/accueil-de-stagiaires-villeurbannais-1753107724"
            />
          )}
        </Col>
      </Row>

      {/* MESSAGE */}
      {showOtherTextarea && (
        <div className="mt-2 offset-xxl-1">
          <FloatingLabel controlId="floatingTextarea">
            <span className="error text-danger">
              {isSubmitted &&
                errors.message?.type === "required" &&
                "Merci de nous écrire un message"}
              {errors.message?.type === "minLength" &&
                "Ecrire plus de 100 caractères"}
              {errors.message?.type === "maxLength" &&
                "Ecrire moins de 700 caractères"}
            </span>
          </FloatingLabel>
          <Form.Control
            as="textarea"
            placeholder={placeholderText}
            rows={1}
            name="message"
            isInvalid={
              !!errors.message && (isSubmitted || touchedFields.message)
            }
            {...register("message", {
              required: showOtherTextarea,
              minLength: 100,
              maxLength: 699,
            })}
            style={{ height: "30vh" }}
          />
        </div>
      )}
      {/* END MESSAGE */}
      {/* MESSAGE PROJET */}
      {showMyProjectTextarea && (
        <div className="mt-2 offset-xxl-1">
          <FloatingLabel controlId="floatingTextarea">
            <span className="error text-danger">
              {isSubmitted &&
                errors.message?.type === "required" &&
                "Merci de nous écrire un message"}
              {errors.message?.type === "minLength" &&
                "Ecrire plus de 100 caractères"}
              {errors.message?.type === "maxLength" &&
                "Ecrire moins de 700 caractères"}
            </span>
          </FloatingLabel>
          <Form.Control
            as="textarea"
            placeholder="Mon projet *"
            rows={1}
            name="my_project"
            isInvalid={
              !!errors.message && (isSubmitted || touchedFields.message)
            }
            {...register("my_project", {
              required: showMyProjectTextarea,
              minLength: 100,
              maxLength: 699,
            })}
            style={{ height: "30vh" }}
          />
          <figcaption>
            <i>
              * Ceci ne constitue pas une demande formelle de financement, nous
              vous recontacterons pour échanger de votre projet plus en
              profondeur.
            </i>
          </figcaption>
        </div>
      )}
      {/* END MESSAGE PROJET */}

      {/* BUTTON */}
      <div className="mt-4 col-12 text-end">
        {" "}
        <Button
          variant="primary"
          size="lg"
          type="submit"
          className="envoyer-btn px-5 rounded-pill"
          disabled={!isValid || isSubmitting}
        >
          Envoyer{" "}
        </Button>
      </div>
      {/* END BUTTON */}
    </Form>
  );
};

export default FormJoinus;
