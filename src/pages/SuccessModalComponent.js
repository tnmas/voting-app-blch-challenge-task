import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function SuccessModalComponent({statusInput, transactionHash,deviceName}) {
    const [show, setShow] = useState(statusInput);

    const handleClose = () => setShow(false);
    //const handleShow = () => setShow(true);

    return (
        <div>
            <Modal show={show} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Transaction finished!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>You've sucessfully ordered your {deviceName} OS.</p>
                    <p>Transaction Hash: {transactionHash}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
