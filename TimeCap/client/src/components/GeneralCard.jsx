import { Card } from "react-bootstrap";

function GerneralCard({id, cardTitle, children, cardName, cardIcon, cardP, childrenId, cardTitleClass, textClass, childrenClass}){
    return(
        <div className="general-card">
            <Card id={id} className={cardName}>
                {/* icon */}
                <Card.Title className={cardTitleClass}>{cardTitle}</Card.Title>
                <Card.Text className={textClass}>{cardP}</Card.Text>
                <div id={childrenId} className={childrenClass}>{children}</div>
            </Card>
        </div>
    )
}

export default GerneralCard