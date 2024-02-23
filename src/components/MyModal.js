import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";

const MyModal = ({ showModal, handleClose, modalData }) => {


  const handleCopy = () => {
    // Create a temporary input element to facilitate copying
    const tempInput = document.createElement('input');
    
    // Set the value of the input to the referral ID
    tempInput.value = `
    🚀 Ready for Easy Earnings? 💸 Join Drip Dash and pocket up to ₦15,000 weekly! 🌟

Earn real cash daily by completing simple tasks, watching ads, and enjoying daily drops. It's quick, fun, and rewarding! 🎉

Don't miss out—start earning effortlessly now: https://dripdash.netlify.app 🌐💰 #EarnWithDripDash`;
    
    // Append the input element to the DOM (not visible)
    document.body.appendChild(tempInput);
    
    // Select the text in the input
    tempInput.select();
    
    // Execute the copy command
    document.execCommand('copy');
    
    // Remove the temporary input element from the DOM
    document.body.removeChild(tempInput);

    // Optionally, provide feedback to the user (e.g., a tooltip or notification)
    toast.info('Sample text copied!', {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  return (
    <><ToastContainer />
    <Modal show={showModal} onHide={handleClose} dialogClassName="modal-90w">
      <Modal.Header closeButton>
        <Modal.Title>Post Instructions</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto' }}>
      <h6 className='d-flex align-items-center'>
      <span className='text-theme'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-link-45deg" viewBox="0 0 16 16">
  <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/>
  <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/>
</svg></span>
        <div>Copy the sample text (to post): </div>
        <p className='mx-2'>
        <button className='remove-btn-style text-theme' onClick={handleCopy}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
           <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z"/>
        </svg></button>
        </p>
        </h6>
      <h2 className="mb-4">WhatsApp:</h2>
      <ul>
        <li>Open WhatsApp on your device.</li>
        <li>Go to your WhatsApp Status.</li>
        <li>Copy our sample text above.</li>
        <li>Paste the sample text on your status.</li>
        <li>Set your privacy settings to ensure the post is visible to others. <span className='bold'>Make sure your 'read receipts' is turned on</span></li>
        <li>Post the message.</li>
        <li>Keep the post visible for at least 12 hours.</li>
        <li>After 12 hours, take a screenshot of the post.</li>
        <li>Upload the screenshot here on Drip Dash to claim your reward.</li>
      </ul>

      <h2 className="mt-5 mb-4">Instagram:</h2>
      <ul>
        <li>Open Instagram on your device.</li>
        <li>Tap the '+' button to create a new post.</li>
        <li>Select the image or video related to 'drip dash.'</li>
        <li>Copy our sample text above.</li>
        <li>Use relevant hashtags to increase visibility.</li>
        <li>Choose whether to share the post on your main feed or story and paste the sample text.</li>
        <li>Post the content.</li>
        <li>Keep the post visible for at least 12 hours.</li>
        <li>After 12 hours, take a screenshot of the post.</li>
        <li>Upload the screenshot here on Drip Dash to claim your reward.</li>
      </ul>

      <h2 className="mt-5 mb-4">Facebook:</h2>
      <ul>
        <li>Open Facebook on your device.</li>
        <li>Navigate to your profile or the group/page where you want to post 'drip dash.'</li>
        <li>Create a new post.</li>
        <li>Copy our sample text above.</li>
        <li>Paste the sample text on your post.</li>
        <li>Set your privacy settings to control who can see the post.<span className='bold'>(To allow others view your post)</span></li>
        <li>Post the content.</li>
        <li>Keep the post visible for at least 12 hours.</li>
        <li>After 12 hours, take a screenshot of the post.</li>
        <li>Upload the screenshot here on Drip Dash to claim your reward.</li>
      </ul>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  );
};

export default MyModal;
