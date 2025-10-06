import { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { FloatingLabel } from "react-bootstrap";
import { useForm } from "react-hook-form";
import "./FormContact.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ShowOptionsIndividualsDetails from "./ShowOptionsIndividualsDetails";

const FormJoinus = () => {
  const {
    register,
    watch,
    formState: { errors, isValid, isSubmitted },
    handleSubmit,
    trigger,
  } = useForm({ mode: "onChange" });

  console.log("FormJoinus Debug - Errors:", errors);
  console.log("FormJoinus Debug - isValid:", isValid);
  console.log("FormJoinus Debug - isSubmitted:", isSubmitted);

  const sendEmail = () => {
    // e.preventDefault();
    emailjs
      .sendForm(
        "service_04voz6b",
        "template_vw8gevu",
        form.current,
        "awYJXfOvl5Y_Sx9cQ"
      )
      .then(
        (result) => {
          console.log(result.text);
          <p>ok</p>;
        },
        (error) => {
          console.log(error.text);
          <p>NON</p>;
        }
      );
    form.current.reset();
  };

  const form = useRef();
  const [showOptionsCompany, setShowOptionsCompany] = useState(false);
  const [showOptionsIndividuals, setShowOptionsIndividuals] = useState(false);
  const [showOptionsIndividualsDetails, setShowOptionsIndividualsDetails] =
    useState(false);

  const isMounted = useRef(false);

  const selectedStatus = watch("status");
  const selectedRequest = watch("request");

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    // Reset all options first
    setShowOptionsCompany(false);
    setShowOptionsIndividuals(false);
    setShowOptionsIndividualsDetails(false);

    if (selectedStatus === "association, entreprise") {
      setShowOptionsCompany(true);
    } else if (selectedStatus === "habitant" || selectedStatus === "eleve") {
      setShowOptionsIndividuals(true);
      if (selectedRequest) {
        // Only set details if a request is selected
        setShowOptionsIndividualsDetails(true);
      }
    }
  }, [
    selectedStatus,
    selectedRequest,
    setShowOptionsCompany,
    setShowOptionsIndividuals,
    setShowOptionsIndividualsDetails,
  ]);

  useEffect(() => {
    // Trigger validation for message field when its requirement changes
    trigger("message");
  }, [showOptionsCompany, showOptionsIndividualsDetails, trigger]);

  return (
    <Form
      ref={form}
      onSubmit={handleSubmit(sendEmail)}
      className="px-0 px-ld-0"
    >
      <div className="row g-4">
        {/* FISRTNAME */}
        <div className="col-12 col-md-4">
          <span className="error text-danger">
            {errors.from_firstname?.type === "minLength" &&
              "Ecrire plus de 2 caractères"}
            {errors.from_firstname?.type === "maxLength" &&
              "Ecrire moins de 20 caractères"}
            {errors.from_firstname?.type === "pattern: /^[A-Za-z]+$/i"}
            {errors.from_firstname?.type === "required" &&
              "Entrez votre prénom"}
          </span>
          <Form.Control
            type="text"
            placeholder="Prénom"
            name="from_firstname"
            {...register("from_firstname", {
              required: true,
              minLength: 3,
              maxLength: 19,
            })}
          />
        </div>
        {/* END FISRTNAME */}
        {/* LASTNAME */}
        <div className="col-12 col-md-4">
          <span className="error text-danger">
            {errors.from_surname?.type === "Entrez votre nom"}
            {errors.from_surname?.type === "minLength" &&
              "Ecrire plus de 2 caractères"}
            {errors.from_surname?.type === "maxLength" &&
              "Ecrire moins de 20 caractères"}
          </span>
          <Form.Control
            type="text"
            placeholder="Nom"
            name="from_surname"
            {...register("from_surname", {
              required: true,
              minLength: 3,
              maxLength: 19,
            })}
          />
        </div>
        {/* END LASTNAME */}
        {/* EMAIL */}
        <div className="col-12 col-md-4">
          <Form.Group controlId="formBasicEmail">
            <span className="error text-danger">
              {errors.from_email?.type === "required" &&
                "Entrez votre adresse e-mail"}
              {errors.from_email?.type === "pattern" &&
                "L'email n'a pas un format correct"}
              {errors.from_email?.type === "minLength" &&
                "Ecrire plus de 14 caractères"}
              {errors.from_email?.type === "maxLength" &&
                "Ecrire 30 caractères au maximum"}
            </span>
            <Form.Control
              type="email"
              placeholder="E-mail"
              name="from_email"
              {...register("from_email", {
                required: true,
                pattern: /^[a-zA-z0-9_.+-]+@[a-zA-z0-9-]+\.[a-zA-Z0-9-.]+$/i,
                minLength: 15,
                maxLength: 30,
              })}
            />
          </Form.Group>
        </div>
        {/* END EMAIL */}
        {/* OBJECT */}
        <div className="col-12 col-md-4">
          <div className="col-12  col-md-12 col-lg-12 ps-lg-1">
            <span className="error text-danger">
              {errors.object?.type === "required" &&
                "Indiquez l'objet de l'email"}
              {errors.object?.type === "minLength" &&
                "Ecrire 10 caractères au minimum"}
              {errors.object?.type === "maxLength" &&
                "Ecrire moins de 50 caractères"}
            </span>
          </div>
          <Form.Control
            type="text"
            placeholder="Objet"
            name="object"
            {...register("object", {
              required: true,
              minLength: 10,
              maxLength: 49,
            })}
          />
        </div>
        {/* END OBJECT */}
      </div>

      <div className="mt-4">
        <div className="row">
          <div className="row col-6 col-md-12 ">
            <div className="col-md-2 col-lg-2 col-xl-2">Je suis</div>
            <div className="col-md-4 col-lg-4 col-xl-3">
              <Form.Check
                inline
                type="radio"
                aria-label="radio 1"
                label="Association, entreprise"
                name="status"
                id="radioAssociation"
                value="association, entreprise"
                {...register("status", {
                  required: false,
                })}
              />
            </div>
            <div className="col-md-2 col-xxl-2">
              <Form.Check
                inline
                type="radio"
                aria-label="radio 1"
                label="Habitant"
                name="status"
                id="radioHabitant"
                value="habitant"
                {...register("status", {
                  required: false,
                })}
              />
            </div>
            <div className="col-md-3 col-xxl-2">
              <Form.Check
                type="radio"
                aria-label="radio 1"
                label="Elève, étudiant"
                name="status"
                id="radioEleve"
                value="eleve"
                {...register("status", {
                  required: false,
                })}
              />
            </div>
          </div>
          <div
            className={`row col-6 col-md-12 options-container-two ${
              showOptionsIndividuals ? "options-container-show-two" : ""
            }`}
          >
            <div className="col-md-2 col-xxl-2">Je cherche</div>
            <div className="col-md-3 col-xxl-3">
              <Form.Check
                type="radio"
                aria-label="radio 1"
                label="Un logement"
                name="request"
                id="radioLogement"
                value="logement"
                {...register("request", {
                  required: false,
                })}
              />
            </div>
            <div className="col-md-2 col-xxl-2">
              <Form.Check
                type="radio"
                aria-label="radio 1"
                label="Un stage"
                name="request"
                id="radioStage"
                value="Un stage"
                {...register("request", {
                  required: false,
                })}
              />
            </div>
            <div className="col-md-5 col-xxl-3">
              <Form.Check
                type="radio"
                aria-label="radio 1"
                label="A être bénèvole sur un projet"
                name="request"
                id="radioBenevole"
                value="A être bénèvole sur un projet"
                {...register("request", {
                  required: false,
                })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MESSAGE */}
      <div
        className={`mt-4 offset-xxl-1 options-container-one ${
          showOptionsCompany || showOptionsIndividualsDetails
            ? "options-container-show-one"
            : ""
        }`}
      >
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
          placeholder="Autres envies/besoins"
          rows={1}
          name="message"
          {...register("message", {
            required: showOptionsCompany || showOptionsIndividualsDetails,
            minLength: 100,
            maxLength: 699,
          })}
          style={{ height: "30vh" }}
        />
      </div>
      {/* END MESSAGE */}

      {/* BUTTON */}
      <div className="mt-4 col-12 text-end">
        {" "}
        <Button
          variant="primary"
          size="lg"
          type="submit"
          className="envoyer-btn px-5 rounded-pill"
          disabled={!isValid}
        >
          Envoyer{" "}
        </Button>
      </div>
      {/* END BUTTON */}
    </Form>
  );
};

export default FormJoinus;
