import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import "../../App.css";
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";

import "./Team.css";
import CarouselComponent from "../../components/Carousel/Carousel";

import TeamMemberCard from "../../components/Cards/TeamMemberCardcop";
import { useAuth } from "../../context/AuthContext";
import EditableTitle from "../../components/EditableTitle"; // Import EditableTitle
import EditableParagraph from "../../components/EditableParagraph";

const AddTeamMemberForm = ({ onSubmit, onCancel }) => {
  const [newMember, setNewMember] = useState({
    lastname: "",
    surname: "",
    occupation: "",
    contact: "",
    alt: "",
  });
  const [category, setCategory] = useState("office");
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name]: value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(category, newMember, imageFile);
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Form.Group>
        <Form.Label>
          <strong>Catégorie</strong>
        </Form.Label>
        <Form.Control
          as="select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="office">Bureau</option>
          <option value="employees">Employés</option>
          <option value="administration">Conseil d'administration</option>
          <option value="instruction">Comité d'instruction</option>
          <option value="scientific">Conseil scientifique</option>
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>
          {" "}
          <strong>Photo de profil</strong>
        </Form.Label>
        <Form.Control type="file" onChange={handleFileChange} required />
      </Form.Group>
      <Form.Group>
        <Form.Label>
          {" "}
          <strong>Texte alternatif</strong>
        </Form.Label>
        <Form.Control
          type="text"
          name="alt"
          value={newMember.alt}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>
          {" "}
          <strong>Nom de famille</strong>
        </Form.Label>
        <Form.Control
          type="text"
          name="lastname"
          value={newMember.lastname}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>
          <strong>Prénom</strong>
        </Form.Label>
        <Form.Control
          type="text"
          name="surname"
          value={newMember.surname}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>
          <strong>Fonction</strong>
        </Form.Label>
        <Form.Control
          type="text"
          name="occupation"
          value={newMember.occupation}
          onChange={handleChange}
        />
      </Form.Group>
      {/* <Form.Group>
        <Form.Label>Contact</Form.Label>
        <Form.Control
          type="text"
          name="contact"
          value={newMember.contact}
          onChange={handleChange}
        />
      </Form.Group> */}

      <Button type="submit" variant="success" className="me-2">
        Créer
      </Button>
      <Button variant="secondary" onClick={onCancel}>
        Annuler
      </Button>
    </Form>
  );
};

export default function Team({ isNavbarHovered }) {
  const SUB = "L'équipe";

  const [teamMembers, setTeamMembers] = useState({
    office: [],
    employees: [],
    administration: [],
    instruction: [],
    scientific: [],
  });
  const { isAuthenticated: isLoggedIn } = useAuth();
  const [isEditable, setIsEditable] = useState(isLoggedIn);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchData = async () => {
    try {
      const teamMembersResponse = await fetch(
        "http://localhost:3001/teammembers"
      );
      if (!teamMembersResponse.ok) {
        throw new Error(`HTTP error! status: ${teamMembersResponse.status}`);
      }
      const teamMembersData = await teamMembersResponse.json();
      setTeamMembers(teamMembersData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTeamMember = async (category, newMember, imageFile) => {
    const formData = new FormData();
    Object.keys(newMember).forEach((key) => {
      formData.append(key, newMember[key]);
    });
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/teammembers/${category}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchData();
      setShowAddForm(false);
    } catch (error) {
      console.error("Error creating team member:", error);
    }
  };

  const handleUpdateTeamMember = async (category, id, updatedMember) => {
    console.log("Team.jsx: updatedMember before fetch", updatedMember);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/teammembers/${category}/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedMember),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchData();
    } catch (error) {
      console.error("Error updating team member:", error);
    }
  };

  const handleDeleteTeamMember = async (category, id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/teammembers/${category}/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setTeamMembers((prevMembers) => ({
        ...prevMembers,
        [category]: prevMembers[category].filter((member) => member.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting team member:", error);
    }
  };

  const renderTeamMembers = (members, category) => {
    return members.map((member) => (
      <TeamMemberCard
        key={member.id}
        item={member}
        isEditable={isEditable}
        onUpdate={handleUpdateTeamMember}
        onDelete={handleDeleteTeamMember}
        category={category}
      />
    ));
  };

  return (
    <>
      <CarouselComponent
        isNavbarHovered={isNavbarHovered}
        category="team"
        carouselTextId={2}
        isEditable={isLoggedIn}
        stationaryText={true}
      />
      <Breadcrumbs breadcrumbsnav="Qui sommes-nous ?" breadcrumbssub={SUB} />

      <section className="reason-section" style={{ paddingTop: "50px" }}>
        <Container className="app-container-padding">
          <Row>
            <Col>
              <EditableTitle textId="team-page-title" defaultTitle={SUB} />

              {isLoggedIn && (
                <Button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="mb-3 btn-main-blue"
                >
                  {showAddForm ? "Annuler" : "Ajouter un membre à l'équipe"}
                </Button>
              )}

              {showAddForm && (
                <AddTeamMemberForm
                  onSubmit={handleCreateTeamMember}
                  onCancel={() => setShowAddForm(false)}
                />
              )}

              {/* OFFICE */}
              <div style={{ marginBottom: "8vh" }}>
                <h4>Bureau</h4>
                <hr />
                <EditableParagraph
                  textId="bureau-paragraph"
                  defaultText="Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit."
                />
                <Row className="g-4">
                  {renderTeamMembers(teamMembers.office, "office")}
                </Row>
                <EditableParagraph
                  textId="employees-email"
                  defaultText="adresse email"
                  isEditable={isLoggedIn}
                />
              </div>
              {/* END OFFICE */}
              {/* EMPLOYEES */}
              <div style={{ marginBottom: "8vh" }}>
                <h4>Employés</h4>
                <hr />
                <EditableParagraph
                  textId="employees-paragraph"
                  defaultText="Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit."
                />
                <Row className="g-4">
                  {renderTeamMembers(teamMembers.employees, "employees")}
                </Row>
                <EditableParagraph
                  textId="employees-email"
                  defaultText="adresse email"
                  isEditable={isLoggedIn}
                />
              </div>
              {/* END EMPLOYEES */}
              {/* ADMINISTRATION ADVISOR */}
              <div style={{ marginBottom: "8vh" }}>
                <h4>conseil d'administration</h4>
                <hr />
                <EditableParagraph
                  textId="administration-paragraph"
                  defaultText="Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit."
                />
                <Row className="g-4">
                  {renderTeamMembers(
                    teamMembers.administration,
                    "administration"
                  )}
                </Row>
              </div>
              {/* END ADMINISTRATION ADVISOR*/}
              {/* INSTRUCTION COMITY */}
              <div style={{ marginBottom: "8vh" }}>
                <h4>comité d'instruction</h4>
                <hr />
                <EditableParagraph
                  textId="instruction-paragraph"
                  defaultText="Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit."
                />
                <Row className="g-4">
                  {renderTeamMembers(teamMembers.instruction, "instruction")}
                </Row>
              </div>
              {/* END INSTRUCTION COMITY */}
              {/* SCIENTIFIC ADVISOR */}
              <div style={{ marginBottom: "8vh" }}>
                <h4>conseil scientifique</h4>
                <hr />
                <EditableParagraph
                  textId="scientific-paragraph"
                  defaultText="Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit."
                />
                <Row className="g-4">
                  {renderTeamMembers(teamMembers.scientific, "scientific")}
                </Row>
              </div>
              {/* END SCIENTIFIC ADVISOR*/}
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
