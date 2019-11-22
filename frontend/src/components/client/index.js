import React, {useEffect, useState} from 'react';

export default function Client(props){
    return(
        <div className="client">
            <div className="flex-row between">
                <h5 className="client-name">{props.name}</h5>
                <div></div>
            </div>
        </div>
    )
}