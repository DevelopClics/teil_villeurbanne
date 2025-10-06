import { useRef } from "react";
import emailjs from "@emailjs/browser";

import { FloatingLabel } from "react-bootstrap";
import { useForm } from "react-hook-form";

import "./FormContact.css";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const FormContact = () => {
  const {
    register,

    formState: { errors, isValid },
    handleSubmit,
  } = useForm({ mode: "onChange" });

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

  return (
    <Form
      ref={form}
      onSubmit={handleSubmit(sendEmail)}
      className="px-0 px-ld-0"
    >
      <div className="row g-4">
        {/* EMAIL */}
        <div className="col-12 col-md-6">
          <Form.Group controlId="formBasicEmail">
            <span className="error text-danger">
              {errors.from_email?.type === "required" &&
                "Entrez votre adresse e-mail"}
              {errors.from_email?.type === "pattern" &&
                "L'email n'a pas un format correct"}
              {errors.from_email?.type === "minLength" &&
                "Ecrire plus de 15 caractères"}
              {errors.from_email?.type === "maxLength" &&
                "Ecrire 40 caractères au maximum"}
            </span>
            <Form.Control
              type="email"
              placeholder="E-mail"
              name="from_email"
              {...register("from_email", {
                required: true,
                pattern: /^[a-zA-z0-9_.+-]+@[a-zA-z0-9-]+\.[a-zA-Z0-9-.]+$/i,
                minLength: 15,
                maxLength: 40,
              })}
            />
          </Form.Group>
        </div>
        {/* END EMAIL */}
        {/* OBJECT */}
        <div className="col-12 col-md-6">
          <div className="col-12  col-md-12 col-lg-12 ps-lg-1">
            <span className="error text-danger">
              {errors.object?.type === "required" &&
                "Indiquez l'objet de l'email"}
              {errors.object?.type === "minLength" &&
                "Ecrire 10 caractères au minimum"}
              {errors.object?.type === "maxLength" &&
                "Ecrire 50 caractères au maximum"}
            </span>
          </div>
          <Form.Control
            type="text"
            placeholder="Objet"
            name="object"
            {...register("object", {
              required: true,
              minLength: 10,
              maxLength: 50,
            })}
          />
        </div>
        {/* END OBJECT */}
      </div>

      {/* MESSAGE */}
      <div className="mt-4">
        <FloatingLabel controlId="floatingTextarea">
          <span className="error text-danger">
            {errors.message?.type === "required" &&
              "Merci de nous écrire un message"}
            {errors.message?.type === "minLength" &&
              "Ecrire plus de 100 caractères"}
            {errors.message?.type === "maxLength" &&
              "Ecrire 700 caractères au maximum"}
          </span>
        </FloatingLabel>
        <Form.Control
          as="textarea"
          placeholder="Message"
          rows={1}
          name="message"
          {...register("message", {
            required: true,
            minLength: 100,
            maxLength: 700,
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
          disabled={!isValid}
          className="envoyer-btn px-5 rounded-pill"
        >
          Envoyer{" "}
        </Button>
      </div>
      {/* END BUTTON */}
    </Form>
  );
};

export default FormContact;
