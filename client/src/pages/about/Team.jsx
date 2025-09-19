import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../../App.css";
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";

import "./Team.css";
import CarouselComponent from "../../components/Carousel/Carousel";

import TeamMemberCard from "../../components/Cards/TeamMemberCardcop";
import { useAuth } from "../../context/AuthContext";
import EditableTitle from "../../components/EditableTitle"; // Import EditableTitle

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

  const handleUpdateTeamMember = async (category, id, updatedMember) => {
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
        title={SUB}
        category="team"
        carouselTextId={2}
        isEditable={isLoggedIn}
      />
      <Breadcrumbs breadcrumbsnav="Qui sommes-nous ?" breadcrumbssub={SUB} />

      <section className="reason-section" style={{ paddingTop: "50px" }}>
        <Container className="app-container-padding">
          <Row>
            <Col>
              <EditableTitle textId="team-page-title" defaultTitle={SUB} />

              {/* OFFICE */}
              <div style={{ marginBottom: "8vh" }}>
                <h4>Bureau</h4>
                <hr />
                <p className="text">
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
                  diam nonummy nibh euismod tincidunt ut laoreet dolore magna
                  aliquam erat volutpat. Ut wisi enim ad minim veniam, quis
                  nostrud exerci tation ullamcorper suscipit.
                </p>
                <Row className="g-4">
                  {renderTeamMembers(teamMembers.office, "office")}
                </Row>
              </div>
              {/* END OFFICE */}
              {/* EMPLOYEES */}
              <div style={{ marginBottom: "8vh" }}>
                <h4>Employés</h4>
                <hr />
                <p className="text">
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
                  diam nonummy nibh euismod tincidunt ut laoreet dolore magna
                  aliquam erat volutpat. Ut wisi enim ad minim veniam, quis
                  nostrud exerci tation ullamcorper suscipit.
                </p>
                <Row className="g-4">
                  {renderTeamMembers(teamMembers.employees, "employees")}
                </Row>
              </div>
              {/* END EMPLOYEES */}
              {/* ADMINISTRATION ADVISOR */}
              <div style={{ marginBottom: "8vh" }}>
                <h4>conseil d'administration</h4>
                <hr />
                <p className="text">
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
                  diam nonummy nibh euismod tincidunt ut laoreet dolore magna
                  aliquam erat volutpat. Ut wisi enim ad minim veniam, quis
                  nostrud exerci tation ullamcorper suscipit.
                </p>
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
                <p className="text">
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
                  diam nonummy nibh euismod tincidunt ut laoreet dolore magna
                  aliquam erat volutpat. Ut wisi enim ad minim veniam, quis
                  nostrud exerci tation ullamcorper suscipit.
                </p>
                <Row className="g-4">
                  {renderTeamMembers(teamMembers.instruction, "instruction")}
                </Row>
              </div>
              {/* END INSTRUCTION COMITY */}
              {/* SCIENTIFIC ADVISOR */}
              <div style={{ marginBottom: "8vh" }}>
                <h4>conseil scientifique</h4>
                <hr />
                <p className="text">
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
                  diam nonummy nibh euismod tincidunt ut laoreet dolore magna
                  aliquam erat volutpat. Ut wisi enim ad minim veniam, quis
                  nostrud exerci tation ullamcorper suscipit.
                </p>
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
