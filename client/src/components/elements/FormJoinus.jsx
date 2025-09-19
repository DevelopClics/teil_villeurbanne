import { useRef } from "react";
// import emailjs from "@emailjs/browser";

import { FloatingLabel } from "react-bootstrap";
import { useForm } from "react-hook-form";

import "./FormContact.css";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

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
            // id="bord-top-left"

            // className="col-2"
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
          <span className="error text-danger">
            {errors.from_surname?.type === "Entrez votre nom"}
            {errors.from_surname?.type === "minLength" &&
              "Ecrire plus de 2 caractères"}
            {errors.from_surname?.type === "maxLength" &&
              "Ecrire moins de 20 caractères"}
          </span>
          <Form.Control
            type="text"
            // className={`col-md-3 mt-1 ${
            //   theme ? `form_control-dark text-light ` : `form_control-light `
            // }`}
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
              //   className={`mt-1 ${
              //     theme ? `form_control-dark text-light ` : `form_control-light `
              //   }`}
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
            // id="bord-top-right"
            // className={`objet ${
            //   theme ? `form_control-dark text-light ` : `form_control-light `
            // }`}
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
              {/* <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="exampleRadios"
                id="exampleRadios2"
                value="option2"
              />
              <label class="form-check-label" for="exampleRadios2"></label>
            </div> */}
              <Form.Check
                inline
                type="radio"
                aria-label="radio 1"
                label="Association, entreprise"
                name="exampleRadios"
                id="exampleRadios2"
              />
            </div>
            <div className="col-md-2 col-xxl-2">
              <Form.Check
                inline
                type="radio"
                aria-label="radio 1"
                label="Habitant"
                name="exampleRadios"
                id="exampleRadios2"
              />
            </div>
            <div className="col-md-3 col-xxl-2">
              <Form.Check
                type="radio"
                aria-label="radio 1"
                label="Elève, étudiant"
                name="exampleRadios"
                id="exampleRadios2"
              />
            </div>
          </div>
          <div className="row col-6 col-md-12">
            <div className="col-md-2 col-xxl-2">Je cherche</div>
            <div className="col-md-3 col-xxl-3">
              <Form.Check
                type="radio"
                aria-label="radio 1"
                label="Un logement"
                name="exampleRadios"
                id="exampleRadios2"
              />
            </div>
            <div className="col-md-2 col-xxl-2">
              <Form.Check
                type="radio"
                aria-label="radio 1"
                label="Un stage"
                name="exampleRadios"
                id="exampleRadios2"
              />
            </div>
            <div className="col-md-5 col-xxl-3">
              <Form.Check
                type="radio"
                aria-label="radio 1"
                label="A être bénèvole sur un projet"
                name="exampleRadios"
                id="exampleRadios2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* MESSAGE */}
      <div className="mt-4 offset-xxl-1">
        <FloatingLabel controlId="floatingTextarea">
          <span className="error text-danger">
            {errors.message?.type === "required" &&
              "Merci de nous écrire un message"}
            {errors.message?.type === "minLength" &&
              "Ecrire plus de 100 caractères"}
            {errors.message?.type === "maxLength" &&
              "Ecrire moins de 700 caractères"}
          </span>
        </FloatingLabel>
        <Form.Control
          as="textarea"
          placeholder="Message"
          rows={1}
          // className={`mt-1 ${
          //   theme ? `form_control-dark text-light ` : `form_control-light `
          // }`}
          name="message"
          {...register("message", {
            required: true,
            minLength: 100,
            maxLength: 699,
          })}
          style={{ height: "30vh" }}
        />
      </div>
      {/* END MESSAGE */}

      {/* BUTTON */}
      <div className="mt-4 col-12 text-end">
        <Button
          variant="primary"
          size="lg"
          type="submit"
          className="envoyer-btn px-5 rounded-pill"
        >
          Envoyer{" "}
        </Button>
      </div>
      {/* END BUTTON */}
    </Form>
  );
};

export default FormJoinus;
