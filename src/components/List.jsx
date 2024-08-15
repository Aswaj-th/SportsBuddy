import React, { useState } from 'react';

const List = ({list, heading}) => {

	return (
		<>
		<h2 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{heading}</h2>
		<ul class="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
			{list.map((el) => {
				return (
					<li>el.name</li>
				)
			})}
		</ul>
		</>
	);
};

export default List;