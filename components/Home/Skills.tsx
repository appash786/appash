import React from "react";
import SkillSection from "./SkillSection";
const Skills = () => {
  const Skills = [
    {
      title: "CODING",
      model: "/Models/Globe_4.glb",
    },
    {
      title: "MOTION",
      model: "/Models/Camera.glb",
    },
    {
      title: "DESIGN",
      model: "/Models/Brush.glb",
    },
  ];
  return (
    <section>
      {Skills.map((Skill, idx) => (
        <SkillSection key={idx} text={Skill.title} model={Skill.model} />
      ))}
    </section>
  );
};

export default Skills;
