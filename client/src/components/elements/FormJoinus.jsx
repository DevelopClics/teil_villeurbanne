import { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { FloatingLabel } from "react-bootstrap";
import { useForm } from "react-hook-form";
import "./FormContact.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
// import ShowOptionsIndividualsDetails from "./ShowOptionsIndividualsDetails";

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
    HOME_NETWORK =
      "Faire partie du réseau d'hébergement ponctuel pour les acteurs de la cooperation qui viennent au Teil/à Villeurbane",
    MORE_INFO = "Avoir plus d'information sur l'accompagnement de l'ADCT",
    PROJECT = "Proposer un projet entre Le Teil et Villeurbanne";

  const form = useRef();
  const [showOptionsCompany, setShowOptionsCompany] = useState(false);
  const [showOtherTextarea, setShowOtherTextarea] = useState(false);
  const [showMyProjectTextarea, setShowMyProjectTextarea] = useState(false);
  const [showRequestSelect, setShowRequestSelect] = useState(false);
  const [showHabitantRequestSelect, setShowHabitantRequestSelect] =
    useState(false);

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
      (status === STUDENT && requestSelectValue === "Autre") ||
      (status === "habitant" && habitantRequestSelectValue === "Autre") ||
      (status === COMPANY && associationRequestSelectValue === "Autre");
    setShowOtherTextarea(show);
  }, [
    status,
    requestSelectValue,
    habitantRequestSelectValue,
    associationRequestSelectValue,
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

  return (
    <Form
      ref={form}
      onSubmit={handleSubmit(sendEmail)}
      className="px-0 px-ld-0"
    >
      <div className="row">
        {/* FIRSTNAME */}
        <div className="col-12 col-md-6 col-xl-4">
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
        </div>
        {/* END FIRSTNAME */}
        {/* LASTNAME */}
        <div className="col-12 col-md-6 col-xl-4">
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
        </div>
        {/* END LASTNAME */}
        {/* EMAIL */}
        <div className="col-12 col-md-6 col-xl-4">
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
        </div>
        {/* END EMAIL */}
        {/* OBJECT */}
        <div className="col-12 col-md-6 col-xl-4">
          <div className="col-12  col-md-12 col-lg-12 ps-lg-1">
            <span className="error text-danger">
              {errors.object?.type === "minLength" &&
                "Ecrire 10 caractères au minimum"}
              {errors.object?.type === "maxLength" &&
                "Ecrire moins de 50 caractères"}
              {touchedFields.from_firstname &&
                !watch("from_lastname") &&
                "Indiquez l'objet de l'email - facultatif"}
            </span>
          </div>
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
        </div>
        {/* END OBJECT */}
        {/* CITY */}
        <div className="col-12 col-md-6 col-xl-4">
          <div className="col-12  col-md-12 col-lg-12 ps-lg-1">
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
          </div>
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
        </div>
        {/* END CITY */}
      </div>

      <div className="mt-4">
        <div className="row">
          <div className="col-12 col-md-6 col-xl-4">
            <div className="col-12 ">
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
            </div>
          </div>
          {showRequestSelect && (
            // LISTE ET BOUTON RADIO
            <div className="row pt-4 pt-md-0 pt-xl-0 col-8 col-md-5 col-xl-3">
              <div className="">
                {/* JE CHERCHE LISTE */}
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
                {/* END JE CHERCHE LISTE */}
              </div>
            </div>
          )}

          {showHabitantRequestSelect && (
            <div className="row pt-4 pt-md-0 pt-xl-0 col-8 col-md-5 col-xl-3">
              <div className="">
                <Form.Select
                  aria-label="Habitant request select"
                  name="habitantRequestSelect"
                  {...register("habitantRequestSelect", { required: false })}
                >
                  <option value="" className="text-center">
                    -- Je souhaite --{" "}
                  </option>
                  <option value={HOME_NETWORK} style={{ whiteSpace: "normal" }}>
                    {HOME_NETWORK}
                  </option>
                  <option value={VOLUNTEER}>{VOLUNTEER}</option>
                  <option value="Autre">Autre</option>
                </Form.Select>
              </div>
            </div>
          )}

          {showOptionsCompany && (
            <div className="row pt-4 pt-md-0 pt-xl-0 col-8 col-md-5 col-xl-3">
              <div className="">
                <Form.Select
                  aria-label="Association request select"
                  name="associationRequestSelect"
                  {...register("associationRequestSelect", { required: false })}
                >
                  <option value="" className="text-center">
                    -- Je souhaite --
                  </option>
                  <option value={PROJECT}>{PROJECT}</option>
                  <option value={MORE_INFO}>{MORE_INFO}</option>
                  <option value="Autre">Autre</option>
                </Form.Select>
              </div>
            </div>
          )}
        </div>
      </div>

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
            placeholder="Autres envies/besoins"
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
            placeholder="Mon projet"
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
