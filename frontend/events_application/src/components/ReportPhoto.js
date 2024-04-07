import { useState } from 'react';
import { IoMdClose } from "react-icons/io";
import Form from 'react-bootstrap/Form';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

function ReportPhoto({ onClose }) {
    const [radioValue, setRadioValue] = useState('1');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const radios = [
        { name: "I just don't like it.", value: '1' },
        { name: 'Inappropriate', value: '2' },
        { name: 'Not relevant ', value: '3' },
    ];

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => {
            onClose(); 
        }, 3050);
    };

    if (isSubmitted) {
        return (
            <div className="report-photo-container text-center">
                <div className="text-success">
                    Your report has been submitted and is under review by our team.
                </div>
            </div>
        );
    }

    return (
        <Form onSubmit={handleSubmit} className="report-photo-container">
            <div className="header mb-3">
                <Form.Label>Why are you reporting this photo?</Form.Label>
                <IoMdClose className="close-button" size={25} onClick={onClose} />
            </div>
            <div className="report-form">
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
            </div>
            <div className="d-flex justify-content-end mt-3">
                <Button type="submit">Submit</Button>
            </div>
        </Form>
    );
}

export default ReportPhoto;
