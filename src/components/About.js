import { useContext, useRef, useEffect, useState, useCallback, Component } from 'react';
import { Container } from 'react-bootstrap';

function About() {

  const scrollContainer = {
    paddingBottom: '80px',
    paddingTop: '20px',
    minHeight: '100vh', // Ensures content takes at least the full height of the viewport
    boxSizing: 'border-box',
    background: 'linear-gradient(to bottom, #3c3f4c, #262A36)', // Gradient from dark purple to a lighter purple
  };

  return (
   <div style={scrollContainer} className='pTop-80'>
    {/* // Main Content Area */}
    <div className="main-content">
      <Container>
        <h1>What is Minting About?</h1>
        <h5 className='mt-4 fw-bold'>What is Minting?</h5>
        <p>Minting is the process of creating new money or coins that enter into circulation. Traditionally, this is how governments produce physical currency—like the coins in your pocket or the bills in your wallet. </p>
        <h5 className='mt-4 fw-bold'>How Minting Works in the Traditional Sense</h5>
        <p>In a traditional bank, minting involves creating physical currency. Central banks are responsible for producing these coins and notes, ensuring they meet the necessary standards, and then distributing them into the economy. When you hear the term "minting" in this context, it’s all about the creation of physical money that can be used in everyday transactions.</p>
        <h5 className='mt-4 fw-bold'>How Minting Works on Our Platform</h5>
        <p>On our platform, minting takes this age-old concept and brings it into the digital world. Instead of producing physical cash, we generate local currency digitally. This process is somewhat similar to how cryptocurrencies are mined, but with a unique twist. </p>
      </Container>
    </div>
   </div>
      
  );
}

export default About;