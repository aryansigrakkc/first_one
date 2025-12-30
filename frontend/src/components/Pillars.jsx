import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "antd";

const pillars = [
  { id: 1, title: "Pillar One", desc: "Description 1" },
  { id: 2, title: "Pillar Two", desc: "Description 2" },
  { id: 3, title: "Pillar Three", desc: "Description 3" },
  { id: 4, title: "Pillar Four", desc: "Description 4" },
  { id: 5, title: "Pillar Five", desc: "Description 5" },
  { id: 6, title: "Pillar Six", desc: "Description 6" },
];

const Pillars = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20 }}>
      {pillars.map((pillar) => (
        <Card
          key={pillar.id}
          title={pillar.title}
          style={{ marginBottom: 16 }}
        >
          <p>{pillar.desc}</p>

          {/* 🔥 VIEW MORE */}
          <Button
            type="primary"
            onClick={() => navigate(`/pillars/${pillar.id}`)}
          >
            View More
          </Button>
        </Card>
      ))}
    </div>
  );
};

export default Pillars;
