import React, { Component } from 'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index';
import { connect } from 'react-redux';

class Auth extends Component {
state = {
    controls:{
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'Email',
                placeholder: 'Mail Address'
            },
            value: '',
            validation: {
                required: true,
                isEmail: true
            },
            valid: false,
            touched: false
        },
        password: {
            elementType: 'input',
            elementConfig: {
                type: 'password',
                placeholder: 'Password'
            },
            value: '',
            validation: {
                required: true,
                minLength: 6
            },
            valid: false,
            touched: false
        },
    },
    isSignup: true
}

inputChangedHandler = (event, controlName) => {
    const updatedControls = {
        ...this.state.controls,
        [controlName]: {
            ...this.state.controls[controlName],
            value: event.target.value,
            valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
            touched: true
        }
    };
    this.setState({controls: updatedControls});
}

submitHandler = (event) => {
    event.preventDefault();
    this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup);
}

checkValidity(value, rules){
    let isValid = true;
    if (rules.required){
        isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength){
        isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength){
        isValid = value.length <= rules.maxLength && isValid;
    }

    if (rules.isEmail){
        isValid = value.length >= 3 && value.indexOf('@') >= 1 && (value.indexOf('@') <= value.length - 2) 
        && value.indexOf('.') != -1 && isValid
    }

    return isValid;
}

switchAuthModeHandler = () => {
    this.setState(prevState => {
        return {
            isSignup: !prevState.isSignup
        }
    })
}

    render () {
        const formElementsArray = [];
        for ( let key in this.state.controls ) {
            formElementsArray.push( {
                id: key,
                config: this.state.controls[key]
            } );
        }

        const form = formElementsArray.map( formElement => (
            <Input
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                changed={( event ) => this.inputChangedHandler( event, formElement.id )} />
        ) );

        return (
            <div className={classes.Auth}>
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType="Success">SUBMIT</Button>
                </form>
                <Button clicked={this.switchAuthModeHandler}
                btnType="Danger">SWITCH TO {this.state.isSignup ? 'SIGN IN' : 'SIGN UP'}</Button>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup))
    }
}

export default connect(null, mapDispatchToProps) (Auth);