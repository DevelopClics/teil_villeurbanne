import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../../App.css";
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import CarouselComponent from "../../components/Carousel/Carousel";
import TeamMemberCard from "../../components/Cards/TeamMemberCardcop";
import { useAuth } from "../../context/AuthContext";

import "./Team.css";

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const teamRes = await fetch("http://localhost:3001/teammembers");
      if (!teamRes.ok) throw new Error(`Team fetch error: ${teamRes.status}`);
      const teamData = await teamRes.json();

      setTeamMembers((prev) => {
        const updated = {};
        Object.entries(teamData).forEach(([category, members]) => {
          updated[category] = members.map((member) => {
            const old = prev?.[category]?.find((m) => m.id === member.id);
            return {
              ...member,
              cacheBust: old?.cacheBust || Date.now(),
            };
          });
        });
        return updated;
      });
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  // IMPORTANT: Update local state directly instead of re-fetching after update
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
        throw new Error(`Update error: ${response.status}`);
      }

      // Update cacheBust timestamp to force image reload
      const updatedWithCacheBust = {
        ...updatedMember,
        cacheBust: Date.now(),
      };

      setTeamMembers((prev) => ({
        ...prev,
        [category]: prev[category].map((member) =>
          member.id === id ? { ...member, ...updatedWithCacheBust } : member
        ),
      }));
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
        throw new Error(`Delete error: ${response.status}`);
      }
      setTeamMembers((prev) => ({
        ...prev,
        [category]: prev[category].filter((m) => m.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting team member:", error);
    }
  };

  const renderTeamMembers = (members, category) =>
    members.map((member) => (
      <TeamMemberCard
        key={member.id}
        item={member}
        isEditable={isEditable}
        onUpdate={handleUpdateTeamMember}
        onDelete={handleDeleteTeamMember}
        category={category}
      />
    ));

  return (
    <>
      <CarouselComponent
        isNavbarHovered={isNavbarHovered}
        title={SUB}
        category="team"
        carouselTextId={2}
      />
      <Breadcrumbs breadcrumbsnav="Qui sommes-nous ?" breadcrumbssub={SUB} />

      <section className="reason-section" style={{ paddingTop: "50px" }}>
        <Container className="app-container-padding">
          <Row>
            <Col>
              <h2>{SUB}</h2>

              {/* OFFICE */}
              <Section
                title="Bureau"
                description="Lorem ipsum dolor sit amet..."
                children={renderTeamMembers(teamMembers.office, "office")}
              />

              {/* EMPLOYEES */}
              <Section
                title="Employés"
                description="Lorem ipsum dolor sit amet..."
                children={renderTeamMembers(teamMembers.employees, "employees")}
              />

              {/* ADMINISTRATION */}
              <Section
                title="Conseil d'administration"
                description="Lorem ipsum dolor sit amet..."
                children={renderTeamMembers(
                  teamMembers.administration,
                  "administration"
                )}
              />

              {/* INSTRUCTION COMMITTEE */}
              <Section
                title="Comité d'instruction"
                description="Lorem ipsum dolor sit amet..."
                children={renderTeamMembers(
                  teamMembers.instruction,
                  "instruction"
                )}
              />

              {/* SCIENTIFIC ADVISORY */}
              <Section
                title="Conseil scientifique"
                description="Lorem ipsum dolor sit amet..."
                children={renderTeamMembers(
                  teamMembers.scientific,
                  "scientific"
                )}
              />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

// Helper component for section layout
function Section({ title, description, children }) {
  return (
    <div style={{ marginBottom: "8vh" }}>
      <h4>{title}</h4>
      <hr />
      <p className="text">{description}</p>
      <Row className="g-4">{children}</Row>
    </div>
  );
}
