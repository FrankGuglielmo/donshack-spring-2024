import { useState } from 'react';
import { IoMdClose } from "react-icons/io";
import Form from 'react-bootstrap/Form';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

function ReportPhoto({ onClose }) {
    const [radioValue, setRadioValue] = useState('1');

    const radios = [
        { name: "I just don't like it.", value: '1' },
        { name: 'Inappropriate', value: '2' },
        { name: 'Not relevant ', value: '3' },
    ];

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('sent request');
        // Here you would handle the submission, e.g., sending data to the server

        // After handling submission, close the form
        onClose();
    };

    return (
        <Form onSubmit={handleSubmit} className="report-photo-container">
            <div className="header">
                <Form.Label>Why are you reporting this photo?</Form.Label>
                <IoMdClose className="close-button" size={25} onClick={onClose} />
            </div>
            <div className="custom-radio-button">
                {radios.map((radio, idx) => (
                    <ToggleButton
                        key={idx}
                        id={`radio-${idx}`}
                        type="radio"
                        variant="outline-primary"
                        name="radio"
                        value={radio.value}
                        checked={radioValue === radio.value}
                        onChange={(e) => setRadioValue(e.currentTarget.value)}
                    >
                        {radio.name}
                    </ToggleButton>
                ))}
            </div>
            <div className="d-flex justify-content-end">
                <Button type="submit">Submit</Button>
            </div>
        </Form>
    );
}

export default ReportPhoto;
