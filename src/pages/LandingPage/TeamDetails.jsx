import React from 'react';
import { leadership } from '../../Data/leadershipData';
import './TeamDetails.scss';

const TeamDetails = () => {
  return (
    <div className="team-details-container">
      <h1>Our Leadership Team</h1>
      <div className="team-members-grid">
        {leadership.map((member, index) => (
          <div key={index} className="team-member-card">
            <img src={member.image} alt={member.name} className="member-image" />
            <h2>{member.name}</h2>
            <h3>{member.title}</h3>
            <h4>{member.role}</h4>
            <p>{member.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamDetails;