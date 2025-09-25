import { Component } from "react"

import "./index.css"

class UserForm extends Component {
    state = {form: { firstName: '', lastName: '', email: '', department: ''}, isEdit: false, successMsg: '', errMsg: ''}

    componentDidMount() {
        const { match, location } = this.props;
        const { id } = match.params || {};

        const searchParams = new URLSearchParams(location.search || "");
        const detailsParam = searchParams.get("details");

        let parsed = null;
        if (detailsParam) {
            try {
                parsed = JSON.parse(decodeURIComponent(detailsParam));
            } catch (err) {
                console.warn("Invalid details in query param", err);
            }
        }

        this.setState({
            form: {
                firstName: parsed?.firstName || '',
                lastName: parsed?.lastName || '',
                email: parsed?.email || '',
                department: parsed?.email || '',
                isEdit: Boolean(id)
            }
        })
    }
    onSubmitEmployeeForm = async event => {
        event.preventDefault()
        const {form, isEdit} = this.state
        let apiUrl

        if (
            !form.firstName.trim() ||
            !form.lastName.trim() ||
            !form.email.trim() ||
            !form.department.trim()
        ) {
            this.setState({errMsg: 'Please fill all the fields'})
            return
        }

        if (isEdit) {
            const {match} = this.props
            const {id} = match.params
            apiUrl =  `${process.env.REACT_APP_API_URL}/users/${id}`
        } else {
            apiUrl = `${process.env.REACT_APP_API_URL}/users`
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        }

        const response = await fetch(apiUrl, options)
        const msg = await response.json()
        
        if (response.ok) {
            this.setState({successMsg: msg, form: {firstName: '', lastName: '', email: '', department: ''}})
        } else {
            this.setState({errMsg: msg})
        }
        
    }

    onChangeFirstname = event => {this.setState(prevState => ({form: {...prevState.form, firstName: event.target.value}}))}

    onChangeLastname = event => {this.setState(prevState => ({form : {...prevState.form, lastName: event.target.value}}))}

    onChangeEmail = event => {this.setState(prevState =>({form: {...prevState.form, email: event.target.value}}))}

    onChangeDepartment = event => {this.setState(prevState => ({form: {...prevState.form,department: event.target.value}}))}

    render() {
        const {form, successMsg, errMsg} = this.state
        const {firstName, lastName, email, department} = form

        return (
            <div className="user-bg-container">
                <form className="user-form-container" onSubmit={this.onSubmitEmployeeForm}>
                    <h1 className="add-user-title">Add User</h1>
                    <div className="add-user-input-container">
                        <label htmlFor="first name" className="add-user-label-heading">First name</label>
                        <input type="text" className="add-user-input-text" value={firstName} id="first name" onChange={this.onChangeFirstname} />
                    </div>
                    <div className="add-user-input-container">
                        <label htmlFor="last name" className="add-user-label-heading">Last name</label>
                        <input type="text" className="add-user-input-text" value={lastName} id="last name" onChange={this.onChangeLastname} />
                    </div>
                    <div className="add-user-input-container user-sub-details-container">
                        <div className="add-user-email-input-container">
                            <label htmlFor="email" className="add-user-label-heading">Email</label>
                            <input type="text" className="add-user-input-text" value={email} id="email" onChange={this.onChangeEmail} />
                        </div>
                        <div className="add-user-email-input-container">
                            <label htmlFor="department" className="add-user-label-heading">Department</label>
                            <select className="department-select-container" id="department" value={department} onChange={this.onChangeDepartment}>
                                <option value=""></option>
                                <option className="user-select-option-text" value="IT">IT</option>
                                <option className="user-select-option-text" value="Finance">Finance</option>
                                <option className="user-select-option-text" value="HR">HR</option>
                            </select>
                        </div>
                    </div>
                    <div className="add-user-email-input-container email-mobile-container">
                        <label htmlFor="email" className="add-user-label-heading">Email</label>
                        <input type="text" className="add-user-input-text" value={email} id="email" onChange={this.onChangeEmail} />
                    </div>
                    <div className="add-user-email-input-container email-mobile-container ">
                        <label htmlFor="department" className="add-user-label-heading">Department</label>
                        <select className="department-select-container" id="department" value={department} onChange={this.onChangeDepartment}>
                            <option value=""></option>
                            <option className="user-select-option-text" value="IT">IT</option>
                            <option className="user-select-option-text" value="Finance">Finance</option>
                            <option className="user-select-option-text" value="HR">HR</option>
                        </select>
                    </div>
                    <div className="add-user-buttons-container">
                        <button className="add-user-button">Cancel</button>
                        <button className="add-user-button employee-submit-button">Register</button>
                    </div>
                    {successMsg && <p className="success-text">{successMsg}</p>}
                    {errMsg && <p className="failure-text">{errMsg}</p>}
                </form>
            </div>
        )
    }
}

export default UserForm