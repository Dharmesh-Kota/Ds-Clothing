import React, { Component } from "react";
import "./sign-in.styles.scss";

import FormInput from "../form-input/form-input.component";
import CustomButton from "../custom-button/custom-button.component";

import { signInWithGoogle } from "../../firebase/firebase.utils";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase/firebase.utils'

class SignIn extends Component {
    constructor() {
        super();

        this.state = {
            email: "",
            password: ""
        };
    }

    validateForm = () => {
        const { email, password } = this.state;
        return email.trim() && password.trim();
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        const { email, password } = this.state;

        // Check if all fields are filled
        if (!this.validateForm()) {
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);

            this.setState({
                email: '',
                password: '',
            });

        } catch (error) {
            console.log('Error creating user: ', error.message);
        }
    }

    handleChange = (e) => {
        e.preventDefault();

        const { value, name } = e.target;
        this.setState({ [name]: value });
    }

    render() {
        return (
            <div className="sign-in">
                <div className="title">
                    <h2>I already have an account</h2>
                    <span>Sign in with your email and password</span>
                </div>

                <form onSubmit={this.handleSubmit} role="form">
                    <FormInput 
                        handleChange={this.handleChange}
                        id="email"
                        label="Email"
                        type="email"
                        name="email" 
                        value={this.state.email} 
                        required
                    />
                    <FormInput 
                        handleChange={this.handleChange}
                        id="password"
                        label="Password"
                        type="password" 
                        name="password" 
                        value={this.state.password}
                        required
                    />

                    <div className="buttons">
                        <CustomButton type="submit"> SIGN IN </CustomButton>
                        <CustomButton 
                            type="button" 
                            onClick={signInWithGoogle} 
                            isGoogleSignIn
                        > 
                            Sign in with Google 
                        </CustomButton>
                    </div>
                </form>
            </div>
        );
    }
}

export default SignIn;