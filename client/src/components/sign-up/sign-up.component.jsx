import React, { Component } from "react";

import './sign-up.styles.scss';

import FormInput from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';

import { auth, createUserProfileDocument } from '../../firebase/firebase.utils';
import { createUserWithEmailAndPassword } from 'firebase/auth'

class SignUp extends Component {
    constructor() {
        super();

        this.state = {
            displayName: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    }

    handleChange = (e) => {
        e.preventDefault();

        const { value, name } = e.target;
        this.setState({ [name]: value });
    }

    validateForm = () => {
        const { displayName, email, password, confirmPassword } = this.state;
        return displayName.trim() && 
               email.trim() && 
               password.trim() && 
               confirmPassword.trim();
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        const { displayName, email, password, confirmPassword } = this.state;
        
        // Check if all fields are filled
        if (!this.validateForm()) {
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);

            await createUserProfileDocument(user, { displayName });

            this.setState({
                displayName: '',
                email: '',
                password: '',
                confirmPassword: ''
            });

        } catch (error) {
            console.log('Error creating user: ', error.message);
        }
    }

    render() {
        const { displayName, email, password, confirmPassword } = this.state;
        return (
            <div className="sign-up">
                <div className="title">
                    <h2>I don't have an account</h2>
                    <span>Sign up with your Email and Password</span>
                </div>

                <form className="sign-up-form" onSubmit={this.handleSubmit} role="form">
                    <FormInput 
                        handleChange={this.handleChange}
                        id="displayName"
                        label="Name"
                        type="text"
                        name="displayName" 
                        value={displayName} 
                        required
                    />
                    <FormInput 
                        handleChange={this.handleChange}    
                        id="email"
                        label="Email"
                        type="email"
                        name="email" 
                        value={email} 
                        required
                    />
                    <FormInput 
                        handleChange={this.handleChange}
                        id="password"
                        label="Password"
                        type="password" 
                        name="password" 
                        value={password}
                        required
                    />
                    <FormInput 
                        handleChange={this.handleChange}
                        id="confirmPassword"
                        label="Confirm Password"
                        type="password" 
                        name="confirmPassword" 
                        value={confirmPassword}
                        required
                    />
                    <div className="buttons">
                        <CustomButton type="submit"> SIGN UP </CustomButton>
                    </div>
                </form>
            </div>
        );
    }
}

export default SignUp;