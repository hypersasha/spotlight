import React, { useState, useEffect } from 'react';
import connect from '@vkontakte/vk-connect';
import View from '@vkontakte/vkui/dist/components/View/View';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Persik from './panels/Persik';
import Spotroom from './panels/Spotroom';

const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [fetchedUser, setUser] = useState(null);
	const [startParams, setStartParams] = useState({});
	//const [popout, setPopout] = useState(<ScreenSpinner size='large' />);

	useEffect(() => {
		connect.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = 'client_dark';
				// data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
		async function fetchData() {
			const user = await connect.sendPromise('VKWebAppGetUserInfo');
			setUser(user);
		}
		fetchData();

		// Try to get app start params.
		receiveStartParams();
	}, []);

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	function receiveStartParams() {
		let hash = window.location.hash.substring(1);
		let hash_array = hash.split('&');
		let start_vars = {};
		hash_array.forEach(hashItem => {
			let hashInfo = hashItem.split('=');
			start_vars[hashInfo[0]] = hashInfo[1];
		})
		setStartParams(start_vars);
	}

	return (
		<View activePanel={activePanel}>
			<Home id='home' fetchedUser={fetchedUser} go={go} />
			<Persik id='persik' go={go} />
			<Spotroom id='spotroom' go={go} startParams={startParams} />
		</View>
	);
}

export default App;

