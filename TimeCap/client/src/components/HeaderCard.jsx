function HeaderCard({id, children, title}){
    return(
        <div id={id} className="header-card p-3 shadow border border-light-subtle rounded-4">
            <div className="header-card-body text-white">
                {children}
            </div>
            <h4 className="fw-normal text-white">{title}</h4>
        </div>
    )
    
}

export default HeaderCard