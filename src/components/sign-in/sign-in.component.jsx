import React, { Component } from "react";
import "./sign-in.styles.scss";

import FormInput from "../form-input/form-input.component";
import CustomButton from "../custom-button/custom-button.component";

class SignIn extends Component {
    constructor() {
        super();

        this.state = {
            email: "",
            password: ""
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();

        this.setState({ email: "", password: "" });
    }

    handleChange = (e) => {
        e.preventDefault();

        const { value, name } = e.target;
        this.setState({ [name]: value });
    }

    render() {
        return (
            <div className="sign-in">
                <h1>I already have an account</h1>
                <span>Sign in with your email and password</span>

                <form onSubmit={this.handleSubmit}>
                    <FormInput 
                        handleChange={this.handleChange}
                        label="Email"
                        type="email"
                        name="email" 
                        value={this.state.email} 
                        required
                    />
                    <FormInput 
                        handleChange={this.handleChange}
                        label="Password"
                        type="password" 
                        name="password" 
                        value={this.state.password}
                        required
                    />

                    <CustomButton type="submit"> Sign In </CustomButton>
                </form>
            </div>
        );
    }
}

export default SignIn;