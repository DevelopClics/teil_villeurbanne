import { useRef, useState } from "react";
// import emailjs from "@emailjs/browser";

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
    formState: { errors },
    handleSubmit,
  } = useForm();

  const sendEmail = () => {
    // e.preventDefault();
    emailjs
      .sendForm(
        "service_04voz6b",
        "template_eyz1vfd",
        form.current,
        "awYJXfOvl5Y_Sx9cQ"
        // "dQwPA98Z1xVRmUVuX"
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
  const [selectedMainType, setSelectedMainType] = useState(""); // New state for main radio buttons
  const [selectedSubType, setSelectedSubType] = useState(""); // New state for sub radio buttons

  // const [showOptionsIndividualsDetails, setShowOptionsIndividualsDetails] =
  //   useState(false);

  const handleMainRadioChange = (e) => {
    setSelectedMainType(e.target.value);
    setSelectedSubType(""); // Always reset sub-type when main type changes
    setShowOptionsIndividualsDetails(false); // Always reset sub-details visibility
  };

  const handleSubRadioChange = (e) => {
    setSelectedSubType(e.target.value);
    setShowOptionsIndividualsDetails(true); // Show details when a sub-option is selected
  };

  return (
    <Form
      ref={form}
      onSubmit={handleSubmit(sendEmail)}
      className="px-0 px-ld-0"
    >
      <div className="row g-4">
        {/* FISRTNAME */}
        <div className="col-12 col-md-4">
          <span
            className="error text-danger"
            style={{ height: "10px", display: "inline-block" }}
          >
            {errors.from_firstname?.type === "minLength" &&
              "Ecrire plus de 2 caractères"}
            {errors.from_firstname?.type === "maxLength" &&
              "Ecrire moins de 20 caractères"}
            {errors.from_firstname?.type === "pattern: /^[A-Za-z]+$/i"}
            {errors.from_firstname?.type === "required" &&
              "Entrez votre prénom"}
            {!errors.from_firstname && <>&nbsp;</>}
          </span>
          <Form.Control
            type="text"
            placeholder="Prénom"
            name="from_firstname"
            {...register("from_firstname", {
              required: false,
              minLength: 3,
              maxLength: 19,
            })}
          />
        </div>
        {/* END FISRTNAME */}
        {/* LASTNAME */}
        <div className="col-12 col-md-4">
          <span
            className="error text-danger"
            style={{ height: "20px", display: "inline-block" }}
          >
            {errors.from_surname?.type === "Entrez votre nom"}
            {errors.from_surname?.type === "minLength" &&
              "Ecrire plus de 2 caractères"}
            {errors.from_surname?.type === "maxLength" &&
              "Ecrire moins de 20 caractères"}
            {!errors.from_surname && <>&nbsp;</>}
          </span>
          <Form.Control
            type="text"
            placeholder="Nom"
            name="from_surname"
            {...register("from_surname", {
              required: false,
              minLength: 3,
              maxLength: 19,
            })}
          />
        </div>
        {/* END LASTNAME */}
        {/* EMAIL */}
        <div className="col-12 col-md-4">
          <Form.Group controlId="formBasicEmail">
            <span
              className="error text-danger"
              style={{ height: "20px", display: "inline-block" }}
            >
              {errors.from_email?.type === "required" &&
                "Entrez votre adresse e-mail"}
              {errors.from_email?.type === "pattern" &&
                "L'email n'a pas un format correct"}
              {errors.from_email?.type === "minLength" &&
                "Ecrire plus de 14 caractères"}
              {errors.from_email?.type === "maxLength" &&
                "Ecrire 30 caractères au maximum"}
              {!errors.from_email && <>&nbsp;</>}
            </span>
            <Form.Control
              type="email"
              //   className={`mt-1 ${
              //     theme ? `form_control-dark text-light ` : `form_control-light `
              //   }`}
              placeholder="E-mail"
              name="from_email"
              {...register("from_email", {
                required: false,
                pattern: /^[a-zA-z0-9_.+-]+@[a-zA-z0-9-]+\.[a-zA-Z0-9-.]+$/i,
                minLength: 10,
                maxLength: 30,
              })}
            />
          </Form.Group>
        </div>
        {/* END EMAIL */}
        {/* OBJECT */}
        <div className="col-12 col-md-4">
          <div className="col-12  col-md-12 col-lg-12 ps-lg-1">
            <span
              className="error text-danger"
              style={{ height: "20px", display: "inline-block" }}
            >
              {errors.object?.type === "required" &&
                "Indiquez l'objet de l'email"}
              {errors.object?.type === "minLength" &&
                "Ecrire 10 caractères au minimum"}
              {errors.object?.type === "maxLength" &&
                "Ecrire moins de 50 caractères"}
              {!errors.object && <>&nbsp;</>}
            </span>
          </div>
          <Form.Control
            type="text"
            placeholder="Objet"
            name="object"
            {...register("object", {
              required: false,
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
                name="mainRadioGroup" // New name for main radio group
                id="radioAssociation"
                value="association"
                checked={selectedMainType === "association"}
                onChange={handleMainRadioChange}
              />
            </div>
            <div className="col-md-2 col-xxl-2">
              <Form.Check
                inline
                type="radio"
                aria-label="radio 1"
                label="Habitant"
                name="mainRadioGroup" // New name for main radio group
                id="radioHabitant"
                value="habitant"
                checked={selectedMainType === "habitant"}
                onChange={handleMainRadioChange}
              />
            </div>
            <div className="col-md-3 col-xxl-2">
              <Form.Check
                type="radio"
                aria-label="radio 1"
                label="Elève, étudiant"
                name="mainRadioGroup" // New name for main radio group
                id="radioEleve"
                value="eleve"
                checked={selectedMainType === "eleve"}
                onChange={handleMainRadioChange}
              />
            </div>
          </div>
          {/* Conditional rendering for sub-options */}
          {(selectedMainType === "habitant" ||
            selectedMainType === "eleve") && (
            <div
              className={`row col-6 col-md-12 options-container-two ${
                selectedMainType === "habitant" || selectedMainType === "eleve"
                  ? "options-container-show-two"
                  : ""
              }`}
            >
              <div className="col-md-2 col-xxl-2">Je cherche</div>
              <div className="col-md-3 col-xxl-3">
                <Form.Check
                  type="radio"
                  aria-label="radio 1"
                  label="Un logement"
                  name="subRadioGroup" // New name for sub radio group
                  id="radioLogement"
                  value="un logement"
                  checked={selectedSubType === "un logement"}
                  onChange={handleSubRadioChange}
                />
              </div>
              <div className="col-md-2 col-xxl-2">
                <Form.Check
                  type="radio"
                  aria-label="radio 1"
                  label="Un stage"
                  name="subRadioGroup" // New name for sub radio group
                  id="radioStage"
                  value="un stage"
                  checked={selectedSubType === "un stage"}
                  onChange={handleSubRadioChange}
                />
              </div>
              <div className="col-md-5 col-xxl-3">
                <Form.Check
                  type="radio"
                  aria-label="radio 1"
                  label="A être bénèvole sur un projet"
                  name="subRadioGroup" // New name for sub radio group
                  id="radioBenevole"
                  value="A être bénèvole sur un projet"
                  checked={selectedSubType === "A être bénèvole sur un projet"}
                  onChange={handleSubRadioChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MESSAGE */}
      <div
        className={`mt-4 offset-xxl-1 options-container-one ${
          selectedMainType === "association" || selectedSubType !== ""
            ? "options-container-show-one"
            : ""
        }`}
      >
        <FloatingLabel controlId="floatingTextarea">
          <span
            className="error text-danger"
            style={{ height: "20px", display: "inline-block" }}
          >
            {errors.message?.type === "required" &&
              "Merci de nous écrire un message"}
            {errors.message?.type === "minLength" &&
              "Ecrire plus de 100 caractères"}
            {errors.message?.type === "maxLength" &&
              "Ecrire moins de 700 caractères"}
            {!errors.message && <>&nbsp;</>}
          </span>
        </FloatingLabel>
        <Form.Control
          as="textarea"
          placeholder="Autres envies/besoins"
          rows={1}
          name="message"
          {...register("message", {
            required: false,
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
          disabled={
            !watch("from_email") ||
            !watch("object") ||
            (selectedMainType !== "association" && selectedSubType === "")
          }
        >
          Envoyer{" "}
        </Button>
      </div>
      {/* END BUTTON */}
    </Form>
  );
};

export default FormJoinus;
