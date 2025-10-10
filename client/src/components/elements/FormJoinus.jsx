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
    setValue,
    formState: { errors, isValid, isSubmitted },
    handleSubmit,
    trigger,
  } = useForm({ 
    mode: "onChange",
    defaultValues: {
      status: "",
      requestSelect: "",
      habitantRequestSelect: "",
    },
   });



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
  const [showOtherTextarea, setShowOtherTextarea] = useState(false);
  const [showRequestSelect, setShowRequestSelect] = useState(false);
  const [showHabitantRequestSelect, setShowHabitantRequestSelect] =
    useState(false);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "status") {
        const status = value.status;
        if (status === "eleve") {
          setShowRequestSelect(true);
          setValue("requestSelect", "");
        } else {
          setShowRequestSelect(false);
        }

        if (status === "habitant") {
          setShowHabitantRequestSelect(true);
          setValue("habitantRequestSelect", "");
        } else {
          setShowHabitantRequestSelect(false);
        }

        if (status === "association, entreprise") {
          setShowOptionsCompany(true);
        } else {
          setShowOptionsCompany(false);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "requestSelect" || name === "habitantRequestSelect") {
        const request = value.requestSelect;
        const habitantRequest = value.habitantRequestSelect;
        setShowOtherTextarea(request === "Autre" || habitantRequest === "Autre");
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    trigger("message");
  }, [showOtherTextarea, trigger]);

  return (
    <Form
      ref={form}
      onSubmit={handleSubmit(sendEmail)}
      className="px-0 px-ld-0"
    >
      <div className="row g-4">
        {/* FIRSTNAME */}
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
        {/* END FIRSTNAME */}
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
          <div className="col-3">
            <div className="col-md-6 col-xxl-12">
              <Form.Select
                aria-label="Default select example"
                name="status"
                {...register("status", { required: false })}
              >
                <option value="">-- Je suis --</option>
                <option value="association, entreprise">
                  Association, entreprise
                </option>
                <option value="habitant">Habitant</option>
                <option value="eleve">Elève, étudiant</option>
              </Form.Select>
            </div>
          </div>
          {showRequestSelect && (
            // LISTE ET BOUTON RADIO
            <div className="row col-8">
              <div className="col-4">
                {/* JE CHERCHE LISTE */}
                <Form.Select
                  aria-label="Default select example"
                  name="requestSelect"
                  {...register("requestSelect", { required: false })}
                >
                  <option value="">-- Je cherche --</option>
                  <option value="logement">Un logement</option>
                  <option value="Un stage">Un stage</option>
                  <option value="A être bénèvole sur un projet">
                    A être bénèvole sur un projet
                  </option>
                  <option value="Autre">Autre</option>
                </Form.Select>
                {/* END JE CHERCHE LISTE */}
              </div>
            </div>
          )}

          {showHabitantRequestSelect && (
            <div className="row col-8">
              <div className="col-4">
                <Form.Select
                  aria-label="Habitant request select"
                  name="habitantRequestSelect"
                  {...register("habitantRequestSelect", { required: false })}
                >
                  <option value="">-- Je souhaite --</option>
                  <option value="option1">
                    Faire partie du réseau d'hébergement ponctuel pour les
                    acteurs de la cooperation qui viennent au Teil / à
                    Villeurbane
                  </option>
                  <option value="option2">Etre bénèvole sur un projet</option>
                  <option value="Autre">Autre</option>
                </Form.Select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MESSAGE */}
      {showOtherTextarea && (
        <div className="mt-4 offset-xxl-1">
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
              required: showOtherTextarea,
              minLength: 100,
              maxLength: 699,
            })}
            style={{ height: "30vh" }}
          />
        </div>
      )}
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
