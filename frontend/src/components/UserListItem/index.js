import { Link } from "react-router-dom"

import "./index.css"

const UserListItem = props => {
    const {userDetails, onClickDelete} = props
    const {id, firstName, lastName, email, department} = userDetails
    const onClickDeleteButton = () => onClickDelete(id)
    return (
        <li className="user-list-item-container">
            <h3 className="user-name">{firstName} {lastName}</h3>
            <p className="user-name">Id: <span className="employee-details">{id}</span></p>
            <p className="user-name">Email: <span className="employee-details">{email}</span></p>
            <p className="user-name">Department: <span className="employee-details">{department}</span></p>
            <div className="buttons-container">
                <Link to={{pathname:`/userform/${id}`, search: `?details=${encodeURIComponent(JSON.stringify(userDetails))}`}} target="_blank">
                    <button className="click-button">Edit</button>
                </Link>
                <button className="click-button" onClick={onClickDeleteButton}>Delete</button>
            </div>
        </li>
    )
}
export default UserListItem