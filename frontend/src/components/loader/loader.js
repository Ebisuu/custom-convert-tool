import React from 'react';
import "./index.css";

export default function Loader(){
	return (
		<div className='loader-container'>
            <div className="loader-content">
            <div class="row center">
                <h1>Loading</h1>
            </div>
			<div class='loader'>
				<svg viewBox='0 0 80 80'>
					<rect x='8' y='8' width='64' height='64'></rect>
				</svg>
			</div>
            </div>
		</div>
	);
}