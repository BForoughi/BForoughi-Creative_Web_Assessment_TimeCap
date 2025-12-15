function HeaderCard({id, children, title}){
    return(
        <div id={id} className="header-card">
            <div className="header-card-body">
                {children}
            </div>
            <h3>{title}</h3>
        </div>
    )
    
}

export default HeaderCard