import { Card } from "react-bootstrap";

function LogCard({children, id, className, cardName, cardTitle, titleClass}){
    return(
        <div id={id} className={className}>
            <Card className={cardName}>
                <Card.Title className={titleClass}>
                    {cardTitle}
                </Card.Title>
                {children}
            </Card>
        </div>
    )
}

export default LogCard