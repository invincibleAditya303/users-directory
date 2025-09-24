import "./index.css"

const Header = props => {
    const {onClickFilter, onClickSearch, searchInput} = props
    const OnClickFilterButton = () => onClickFilter()
    const onClickSearchButton = event => onClickSearch(event.target.value)

    return (
        <div className="header-container">
            <h1 className="directory-title">Users Directory</h1>
            <div className="header-input-container">
                <input type="text" placeholder="Search by name or email" value={searchInput} className="search-input-text" onChange={onClickSearchButton} />
            </div>
            <button className="filter-button" onClick={OnClickFilterButton}>Filter</button>
        </div>
    )
}

export default Header