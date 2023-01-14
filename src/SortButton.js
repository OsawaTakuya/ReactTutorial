import React from "react";

const SortButton = ({ hundleSortClick }) => {

    const hundleClick = (bool) => {
        hundleSortClick(bool);
        
    };
    
    
    return (

        <div className='sort-button'>
            <button onClick={hundleSortClick(true)}>昇順</button>
            <button onClick={hundleSortClick(false)}>降順</button>
        </div>
    )
};




export default SortButton;