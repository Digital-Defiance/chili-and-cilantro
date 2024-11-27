import React from 'react';
import { Link } from 'react-router-dom';
import chiliCilantroLogo from '../../assets/images/Chili-and-Cilantro-logo.png';
import './splash-page.scss';

const SplashPage: React.FC = () => {
  return (
    <div className="splash-container">
      <img
        src={chiliCilantroLogo}
        alt="Chili and Cilantro"
        className="splash-logo"
        style={{ width: '60%', maxWidth: '1035px', height: 'auto' }}
      />
      <p className="splash-subdescription">A Spicy Bluffing Game</p>
      <div className="feature-list">
        <h2 className="feature-title playfair-display-regular">
          Key Features:
        </h2>
        <ul className="feature-bullets">
          <li>Exciting bluffing gameplay with a culinary twist</li>
          <li>Strategic bidding and card placement</li>
          <li>Quick to learn, challenging to master</li>
          <li>Supports 2 or more players</li>
          <li>Rounds of suspenseful card flipping</li>
          <li>Risk management: avoid the dreaded chili!</li>
          <li>First to season two dishes or last chef standing wins</li>
          <li>Perfect for game nights and family gatherings</li>
        </ul>
      </div>
      <div className="game-description">
        <h3>How to Play:</h3>
        <p>
          In Chili and Cilantro, aspiring chefs compete to create the perfect
          dish. Your goal is to add just the right amount of cilantro without
          ruining it with a scorching chili. Be the first to successfully season
          two dishes or be the last chef standing to win!
        </p>
      </div>
      <div className="cta-container">
        <Link to="/register" className="btn btn-primary">
          Start Cooking!
        </Link>
        <Link to="/login" className="btn btn-secondary">
          Return to Kitchen
        </Link>
      </div>
    </div>
  );
};

export default SplashPage;
