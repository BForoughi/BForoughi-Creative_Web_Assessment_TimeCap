import { Card } from "react-bootstrap";

function GerneralCard({id, cardTitle, children, cardName, cardIcon, cardP, childrenId, cardTitleClass, textClass, childrenClass, imgId}){
    return(
        <div className="general-card">
            <Card id={id} className={cardName}>
                <div className="d-flex">
                    <Card.Img id={imgId} src={cardIcon}></Card.Img>
                    <Card.Title className={cardTitleClass}>{cardTitle}</Card.Title> 
                </div>
                <Card.Text className={textClass}>{cardP}</Card.Text>
                <div id={childrenId} className={childrenClass}>{children}</div>
            </Card>
        </div>
    )
}

export default GerneralCard