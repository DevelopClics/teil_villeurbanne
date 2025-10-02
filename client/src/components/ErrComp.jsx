import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./ErrComp.css";

export default function ErrComp() {
  return (
    <>
      <p>
        Vous vous êtes perdu en route ?
        <br />
        Probablement entre Le Teil et Villeurbanne… <br />
        <br />
        Aucun soucis ! <br /> <br />
        Nous vous souhaitons un bon retour à notre
        <Link to="/">
          <Button className="common-button">PAGE D'ACCUEIL</Button>
        </Link>
      </p>
    </>
  );
}
