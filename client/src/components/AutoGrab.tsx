import React, { useState } from 'react';
import axios from 'axios';
import './AutoGrab.css'
import { FaCheckCircle, FaUpload } from 'react-icons/fa';

interface IData {
    make: string;
    models: { [model: string]: string[] };
}

const vehicleData: IData[] = [
    {
        make: 'Tesla',
        models: {
            'Model 3': ['Standard', 'Performance', 'Long Range'],
            'Model S': ['Standard', 'Plaid'],
            'Model X': ['Standard', 'Plaid'],
        },
    },
    {
        make: 'Ford',
        models: {
            'Ranger': ['Raptor', 'Raptor x', 'wildtrak'],
            'Falcon': ['XR6', 'XR6 Turbo', 'XR8'],
            'Falcon UTE': ['XR6', 'XR6 Turbo'],
            'Fiesta': ['Base', 'Standard'],
        },
    },
    {
        make: 'BMW',
        models: {
            '3 Series': ['Standard', 'M Sport'],
            '5 Series': ['Standard', 'M Sport'],
        },
    },
];

const AutoGrab = () => {
    const [make, setMake] = useState<string>('');
    const [model, setModel] = useState<string>('');
    const [badge, setBadge] = useState<string>('');
    const [logbook, setLogbook] = useState<File | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [responseMessage, setResponseMessage] = useState<string | null>(null);

    // handle to change make
    const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMake(e.target.value);
        setModel('');
        setBadge('');
    };

    // handle to change model
    const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setModel(e.target.value);
        setBadge('');
    };

    // handle to change badge
    const handleBadgeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setBadge(e.target.value);
    };

    // handle to manage log file upload
    const handleLogbookUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setLogbook(e.target.files[0]);
        }
    };

    // function to prefill the behicle data
    const prefillVehicle = (prefillMake: string, prefillModel: string, prefillBadge: string) => {
        setMake(prefillMake);
        setModel(prefillModel);
        setBadge(prefillBadge);
    };

    // handle to submit the form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setSubmitted(true);
        setResponseMessage(null);

        const formData = {
            make: make,
            model: model,
            badge: badge,
            logbook: logbook
        }

        try {
            const response = await axios.post('http://localhost:3001/api/vehicle', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResponseMessage(`${JSON.stringify(response.data, null, 2)}`);
        } catch (error: any) {
            setResponseMessage('Error submitting the vehicle form. Please try again.');
        } finally {
            setSubmitted(false);
        }
    };

    const models: any = make ? Object.keys(vehicleData.find((v: any) => v.make === make)?.models || {}) : [];
    const badges: any = model ? vehicleData.find((v: any) => v.make === make)?.models[model] || [] : [];

    return (
        <div className="form-container">
            <form className="vehicle-form" onSubmit={handleSubmit}>
                <h1 className="form-title">Select Your Vehicle</h1>

                {/* show message after success submission */}
                {responseMessage && (
                    <div className="response-message">
                        <FaCheckCircle className="success-icon" />{`Vehicle submitted successfully: `} {responseMessage}
                    </div>
                )}

                {/* select for car make */}
                <div className="form-group">
                    <label>
                        Make:
                        <select value={make} onChange={handleMakeChange} className="form-control">
                            <option value="">Select Make</option>
                            {vehicleData.map((v) => (
                                <option key={v.make} value={v.make}>
                                    {v.make}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                {/* select for model */}
                <div className="form-group">
                    <label>
                        Model:
                        <select value={model} onChange={handleModelChange} disabled={!make} className="form-control">
                            <option value="">Select Model</option>
                            {models.map((m: any) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                {/* select fro badge */}
                <div className="form-group">
                    <label>
                        Badge:
                        <select value={badge} onChange={handleBadgeChange} disabled={!model} className="form-control">
                            <option value="">Select Badge</option>
                            {badges.map((b: any) => (
                                <option key={b} value={b}>
                                    {b}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <div className="form-group">
                    <label>
                        Logbook:
                        <div className="file-upload">
                            <input type="file" onChange={handleLogbookUpload} accept=".txt" className="file-input" />
                            <FaUpload className="upload-icon" />
                            {logbook ? <span className="file-name">{logbook.name}</span> : 'Choose file'}
                        </div>
                    </label>
                </div>

                {/* submit button */}
                <button type="submit" className="form-submit" disabled={submitted}>
                    {submitted ? 'Submitting...' : 'Submit'}
                </button>

                {/* button for prefill data 1 */}
                <div className="prefill-buttons">
                    <button
                        type="button"
                        onClick={() => prefillVehicle('Tesla', 'Model 3', 'Performance')}
                        className="prefill-button">
                        Tesla Model 3 Performance
                    </button>

                    {/* button for orefill data 2 */}
                    <button
                        type="button"
                        onClick={() => prefillVehicle('Ford', 'Fiesta', 'Base')}
                        className="prefill-button">
                        Ford Fiesta Base
                    </button>
                </div>

            </form>
        </div>
    );
};

export default AutoGrab;