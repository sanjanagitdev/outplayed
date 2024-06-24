import React from 'react';
const Supportlisting = ({ ticketsList }) => {
    return (
        <div className="middle-wrapper">
            <div className="support-header">
                <h6>Support</h6>
            </div>
            <div className="support-listing support-page">
                <div className="support-table">
                    <div className="support-header">
                        <div className="number">
                            Sr No.
               </div>
                        <div className="Category">
                            Category
               </div>
                        <div className="State">
                            State
               </div>
                        <div className="answer">
                            Answer
               </div>
                    </div>
                    {ticketsList && ticketsList.map((el, index) => {
                        return <ListItems element={el} index={index} />
                    })}
                </div>
            </div>
        </div>
    )
}
export default Supportlisting;

const ListItems = ({ element, index }) => {
    const { subject, status, replies } = element;
    return <div className="support-body" key={index}>
        <div className="number">
            {index + 1}
        </div>
        <div className="Category">
            {subject}
        </div>
        <div className="State">
            {status}
        </div>
        <div className="answer">
            {replies && replies.length > 0 ? replies[0].answer : 'Not answered by admin'}
        </div>
    </div>
}