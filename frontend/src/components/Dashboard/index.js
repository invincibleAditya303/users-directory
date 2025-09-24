import { Component } from "react";
import { Link } from "react-router-dom";
import {RingLoader} from "react-spinners" 

import "./index.css"
import Header from "../Header"
import Footer from "../Footer"
import UserListItem from "../UserListItem"
import FilterGroup from "../FilterGroup"
import Pagination from "../Pagination"

const apisStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class Dashboard extends Component {
    state = {usersList: [], originalUsersList: [], filteredList: [], isFilterGroupClicked: false, isFilterActive: false, searchInput: "", sortType: "none", firstNameFilter: "", departmentFilter: "", pageNo: 1, apiStatus: apisStatusConstants.initial}


    componentDidMount () {
        this.getUserslist()
    }

    getUserslist = async () => {
        this.setState({apiStatus: apisStatusConstants.inProgress})

        const apiUrl = 'http://localhost:5000/users'
        const response = await fetch(apiUrl)
        console.log(response)
        
        if (response.ok) {
            const userData = await response.json()
            const {data} = userData
            console.log(data)
            const usersDetails = data.map(eachUser => ({
                id: eachUser.id,
                firstName: eachUser.first_name,
                lastName: eachUser.last_name,
                email: eachUser.email,
                department: eachUser.department
            }))
            this.setState({usersList: usersDetails, originalUsersList: usersDetails, apiStatus: apisStatusConstants.success})
        }
    }

    onClickFilter = () => {this.setState(prevState => ({isFilterActive: !prevState.isFilterActive}))}

    onChangeFirstName = eventType => {this.setState({firstNameFilter: eventType})}

    onChangeDepartment = eventType => {this.setState({departmentFilter: eventType})}

    onSubmitFilterForm = filterEvent => {
        filterEvent.preventDefault()

        const {usersList, searchInput, pageNo, firstNameFilter, departmentFilter} = this.state
        const upperLimit = pageNo * 8

        let currentUsersList = usersList.slice(upperLimit-8, upperLimit)
        currentUsersList = currentUsersList.filter(eachUser => (eachUser.firstName ?? '').toLowerCase().includes(searchInput.toLowerCase()))
        const filteredUsersList = currentUsersList.filter(eachUser => {
            const matchesName = firstNameFilter? eachUser.firstName.toLowerCase().includes(firstNameFilter.toLowerCase()): false;

            const matchesDept = departmentFilter? eachUser.department.toLowerCase() === departmentFilter.toLocaleLowerCase(): false;

            // Include only if at least one is true
            return matchesName || matchesDept;
        })

        this.setState({filteredList: filteredUsersList, isFilterGroupClicked: true})
    }

    onClickReset = () => {
        this.setState({firstNameFilter: "", departmentFilter: "", isFilterGroupClicked: false})
    }

    onClickSearch = inputText => {this.setState({searchInput: inputText})}

    onChangeSortType = event => {
        const {originalUsersList, pageNo} = this.state
        const upperLimit = pageNo * 8
        const lowerLimit = (pageNo - 1) * 8
        const sortField = event.target.value
        let newUsersList

        if (sortField === "firstName") {
            newUsersList = [...originalUsersList]
            newUsersList.sort((a, b) => {
                const x = a.firstName?.toLowerCase() ?? ""
                const y = b.firstName?.toLowerCase() ?? ""
                return x < y ? -1 : x > y ? 1 : 0
            })
        }
        else if (sortField === 'department') {
            newUsersList = [...originalUsersList]
            newUsersList.sort((a, b) => {
                const x = a.department?.toLowerCase() ?? ""
                const y = b.department?.toLowerCase() ?? ""
                return x < y ? -1 : x > y ? 1 : 0
            })
        } else {
            newUsersList = [...originalUsersList]
        }

        const pagedList = newUsersList.slice(lowerLimit, upperLimit)

        this.setState({usersList: pagedList, sortType: sortField})
    }

    onClickPrev = () => {
        const {pageNo} = this.state
        
        if (pageNo > 1) {
            this.setState(prevState => ({pageNo: prevState.pageNo - 1}))
        }
    }

    onClickNext = () => {
        const {pageNo, usersList} = this.state
        const lastPage = Math.ceil(usersList.length / 8)

        if (pageNo < lastPage) {
            this.setState(prevState => ({pageNo: prevState.pageNo + 1}))
        }

    }

    onClickDelete = async userId => {
        const confirmed = window.confirm("Are you sure you want to delete this address?");
        if (!confirmed) return

        const apiUrl = `http://localhost:5000/users/${userId}`
        const options = {
            method: 'DELETE'
        }

        const response = await fetch(apiUrl, options)

        if (response.ok) {
        window.alert("Address deleted successfully.");
        this.setState(prevState => {
            const currentUsersList = prevState.usersList.map(eachUser => eachUser.id !== userId)
            return {usersList: currentUsersList}
        });
        } else {
        window.alert("Failed to delete the User. Please try again.");
        }
    }

    renderLoaderView = () => (
        <RingLoader color="#36d7b7"  size={30} />
    )

    renderFailureView = () => (
    <div className="users-section-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="users-section-failure-view-img"
      />
      <h1 className="users-section-failure-heading">
        Oops! Something went Wrong
      </h1>
      <p className="users-section-failure-text">
        We cannot seem to find the page you looking for
      </p>
      <button
        type="button"
        className="users-section-retry-button"
        onClick={this.onClickRetryButton}
      >
        Retry
      </button>
    </div>
  )

    renderSuccessView = () => {
        const {usersList, searchInput, pageNo, filteredList, isFilterGroupClicked} = this.state
        const upperLimit = pageNo * 8

        let currentUsersList

        if (isFilterGroupClicked) {
            currentUsersList = filteredList
        }
        else {
            currentUsersList = usersList.slice(upperLimit-8, upperLimit)
        }

        currentUsersList = currentUsersList.filter(eachUser => (eachUser.firstName ?? '').toLowerCase().includes(searchInput.toLowerCase())  || (eachUser.email ?? '').toLowerCase().includes(searchInput.toLowerCase()))

        return (
            <ul className="users-list-container">
                {currentUsersList.map(eachUser => 
                    <UserListItem userDetails={eachUser} key={eachUser.id} onClickDelete={this.onClickDelete} />
                )}
            </ul>
        )
    }

    renderStatusView = () => {
        const {apiStatus} = this.state
        console.log(apiStatus)
    
        switch (apiStatus) {
          case apisStatusConstants.success:
            return this.renderSuccessView()
          case apisStatusConstants.inProgress:
            return this.renderLoaderView()
          case apisStatusConstants.failure:
            return this.renderFailureView()
          default:
            return null
        }
      }

    render() {
        const {usersList, isFilterActive, searchInput, sortType, pageNo, firstNameFilter, departmentFilter} = this.state
        const upperLimit = pageNo * 8

        let currentUsersList = usersList.slice(upperLimit-8, upperLimit)
        currentUsersList = currentUsersList.filter(eachUser => (eachUser.firstName ?? '').toLowerCase().includes(searchInput.toLowerCase()))
        const dashboardFullwidth = isFilterActive ? "compress-container" : ""
        const totalPages = Math.ceil(usersList.length / 8)

        return (
            <div className="dashboard-bg-container">
                <div className={`dashboard-container ${dashboardFullwidth}`}>
                    <Header onClickFilter={this.onClickFilter} onClickSearch={this.onClickSearch} searchInput={searchInput} />
                    <div className="sorting-container">
                        <div className="sorting-type-container">
                            <label className="sorting-label">Sort:</label>
                            <select className="select-sort" value={sortType} onChange={this.onChangeSortType}>
                                <option className="sort-type" value="firstName">First Name</option>
                                <option className="sort-type" value="department">Department</option>
                                <option className="sort-type" value="none">None</option>
                            </select>
                            <label className="sorting-label">Show:</label>
                            <select className="select-sort" >
                                <option className="sort-type" checked>10</option>
                            </select>
                        </div>
                        <Link to="/userform" target="_blank">
                            <button type="button" className="add-button">Add User</button>
                        </Link>
                    </div>
                    {this.renderStatusView()}
                    <Pagination pageNo={pageNo} totalPages={totalPages} onClickPrev={this.onClickPrev} onClickNext={this.onClickNext} />
                    <Footer />
                </div>
                <FilterGroup 
                    isFilterActive={isFilterActive}
                    currentUsersList={currentUsersList}
                    firstNameFilter={firstNameFilter} 
                    departmentFilter={departmentFilter} 
                    onChangeFirstName={this.onChangeFirstName}
                    onChangeDepartment={this.onChangeDepartment}
                    onSubmitFilterForm={this.onSubmitFilterForm}
                    onClickReset={this.onClickReset}
                />
            </div>
        )
    }
}

export default Dashboard