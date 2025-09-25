import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProjectLayout from '../../components/layouts/ProjectLayout';
import { getPageTitle } from '../../utils/pageTitle'; // Assuming this utility exists

const Youth = () => {
  const { id } = useParams();
  const [pageTitle, setPageTitle] = useState('');

  useEffect(() => {
    const fetchPageTitle = async () => {
      const title = await getPageTitle('youth-projects-title'); // Unique ID for youth projects title
      setPageTitle(title);
    };

    fetchPageTitle();
  }, []);

  const projectDetails = {
    title: pageTitle,
    description: "Our youth programs are designed to empower young individuals, providing them with opportunities for growth, education, and community involvement. We focus on developing skills, fostering leadership, and promoting well-being among the youth.",
    sections: [
      {
        heading: "Empowering the Next Generation",
        content: "We are committed to creating a supportive environment where young people can thrive. Our initiatives range from educational support and mentorship programs to recreational activities and civic engagement projects, all tailored to meet the unique needs of youth."
      },
      {
        heading: "Key Youth Initiatives",
        content: "Our projects include after-school programs, vocational training, sports leagues, arts workshops, and leadership development camps. We partner with schools, local organizations, and youth leaders to deliver impactful programs that make a difference."
      },
      {
        heading: "Join Our Youth Programs",
        content: "We encourage all young people to explore our diverse range of programs. Whether you're looking to learn new skills, meet new friends, or contribute to your community, there's a place for you. Volunteers and mentors are also welcome to join our cause."
      }
    ],
    image: "/images/photos/carousel/youth/youth-banner.jpg", // Example image path
    gallery: [
      "/images/photos/projects/youth/youth-program1.jpg",
      "/images/photos/projects/youth/youth-workshop.jpg",
      "/images/photos/projects/youth/youth-event.jpg"
    ]
  };

  return (
    <ProjectLayout project={projectDetails} />
  );
};

export default Youth;